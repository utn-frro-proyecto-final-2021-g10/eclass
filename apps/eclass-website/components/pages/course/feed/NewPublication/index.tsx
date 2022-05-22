import React, { useState } from "react";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";
import {
  Avatar,
  HStack,
  IconButton,
  Textarea,
  VStack,
  Box,
  useBoolean,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";
import { Card, CardBody } from "../../../../Card";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Skeleton } from "../../../../Skeleton";
import { useQueryClient } from "react-query";

export const NewPublication = ({ forumId }: { forumId: string }) => {
  const me = useCurrentUser();
  const queryClient = useQueryClient();

  const [InputFocus, setInputFocus] = useBoolean(false);
  const [inputValue, setInputValue] = useState("");
  const [showMarkdown, setShowMarkdown] = useBoolean();

  const sendMessage = async () => {
    if (inputValue.length > 0) {
      await fetch("/api/v1/course/feed/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: inputValue,
          forumId,
        }),
      }).then((res) => {
        queryClient.invalidateQueries("current-course");
      });
      setShowMarkdown.off();
      setInputFocus.off();
      setInputValue("");
    }
  };

  if (!(forumId && me)) {
    return (
      <Skeleton>
        <Card>
          <CardBody>
            <Textarea minHeight="3rem" />
          </CardBody>
        </Card>
      </Skeleton>
    );
  }

  return (
    <Card borderColor={InputFocus ? "teal.200" : undefined} height="100%">
      <CardBody>
        <HStack
          justify="space-between"
          height="100%"
          onFocus={() => {
            setInputFocus.on();
          }}
        >
          <HStack width="100%" spacing={4} align="start" height="100%">
            <VStack height="100%" justify="space-between" position="relative">
              <Avatar size="sm" src={me?.profileImageUrl} />
              {InputFocus && (
                <IconButton
                  pos="sticky"
                  bottom={0}
                  aria-label="result"
                  variant="ghost"
                  icon={showMarkdown ? <EditIcon /> : <ViewIcon />}
                  onClick={() => setShowMarkdown.toggle()}
                />
              )}
            </VStack>
            {showMarkdown ? (
              <Box w="100%" minHeight="15rem">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {inputValue}
                </ReactMarkdown>
              </Box>
            ) : (
              <Textarea
                placeholder="Haz una publicacion!"
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                borderWidth="0 1px 0 1px !important"
                focusBorderColor="unset"
                borderRadius="0"
                value={inputValue}
                height={InputFocus ? "15rem" : "3rem"}
                minHeight="3rem"
                resize="none"
              />
            )}
            <IconButton
              aria-label="send"
              icon={<ArrowForwardIcon boxSize="1.5rem" />}
              size="md"
              colorScheme="teal"
              variant="ghost"
              disabled={inputValue.length === 0}
              height="100%"
              sx={{
                borderRightRadius: "2xl",
              }}
              zIndex={1}
              onClick={sendMessage}
            />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};
