import { Reply } from "@prisma/client";
import { Text, VStack, HStack, Avatar, Heading, Badge } from "@chakra-ui/react";
import { Card, CardBody } from "../../../../Card";
import { parseDate } from "../../../../../utils/parseDate";

export const Response = ({ response }: { response: Reply }) => {
  return (
    <Card baseColor="light" hasShadow={false}>
      <CardBody>
        <HStack align="top">
          <Avatar size="sm" src={response.user.profileImageUrl} />
          <VStack align="left" spacing={1} w="100%">
            <HStack justifyContent="space-between" w="100%">
              <Heading fontSize={["sm", "md","lg"]}>
                {response.user.firstName} {response.user.lastName}
              </Heading>
              <Badge colorScheme="blackAlpha" variant="outline">
                {parseDate(response.datetime)}
              </Badge>
            </HStack>
            <Text>{response.description}</Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};
