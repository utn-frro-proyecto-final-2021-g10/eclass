import React, { useState } from "react";
import {
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Textarea,
  useBoolean,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ChatIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { Reply } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useQueryClient } from "react-query";
import { Response } from "./response";
import { parseDate } from "../../../../../utils/parseDate";

interface Props {
  message: any;
}
export const Publication = ({ message }: Props) => {
  const [showComments, setShowcomment] = useBoolean();
  const [InputValue, setInputValue] = useState("");

  const [InputFocus, setInputFocus] = useBoolean(false);

  const queryClient = useQueryClient();

  const sendReply = async () => {
    if (InputValue.length > 0) {
      await fetch("/api/v1/course/feed/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: InputValue,
          messageId: message.id,
        }),
      }).then(() => {
        queryClient.invalidateQueries("current-course");
        setShowcomment.on();
        setInputFocus.off();
      });

      setInputValue("");
    }
  };

  return (
    <Card>
      <CardHeader max-width="100%">
        <HStack justifyContent="space-between">
          <HStack spacing="2">
            <Avatar size="sm" src={message.user.profileImageUrl} />
            <Text fontSize="xl">
              {message.user.firstName} {message.user.lastName}
            </Text>
          </HStack>
          <Badge colorScheme="teal">{parseDate(message.datetime)}</Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3}>
          <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
            {message.description}
          </ReactMarkdown>
          <HStack spacing={3} paddingTop="4">
            <HStack
              spacing={1}
              align="center"
              as="button"
              onClick={() => {
                message.replies.length > 0
                  ? setShowcomment.toggle()
                  : setShowcomment.off();
              }}
            >
              <ChatIcon />
              <Text fontSize="sm">
                {message.replies?.length || 0}{" "}
                {message.replies?.length === 1 ? "comentario" : "comentarios"}
              </Text>
            </HStack>
          </HStack>
          <Divider />
          {showComments && (
            <>
              {message?.replies?.map((response: Reply, index: string) => (
                <Response response={response} key={index} />
              ))}
              <Divider />
            </>
          )}
          <HStack pos="relative">
            <Textarea
              borderColor="teal.400"
              focusBorderColor="teal.200"
              borderRadius="2xl"
              placeholder="Comentar..."
              value={InputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onFocus={() => {
                setInputFocus.on();
              }}
              resize="none"
              minHeight={InputFocus ? "8rem" : "2rem"}
            />
            <IconButton
              aria-label="send"
              icon={<ArrowForwardIcon boxSize="1.5rem" />}
              size="md"
              variant="ghost"
              colorScheme="teal"
              onClick={sendReply}
              disabled={InputValue.length === 0}
              position="absolute"
              right={2}
              sx={{
                borderRightRadius: "2xl",
              }}
              height="80%"
              zIndex={1}
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
