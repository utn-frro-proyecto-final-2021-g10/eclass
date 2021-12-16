import { Text, VStack, HStack, Avatar, Divider } from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "../../../../Card";

export const MemberList = () => {
  return (
    <Card>
      <CardHeader>
        <HStack spacing="2">
          <Avatar size="sm" />
          <Text fontSize="xl">Tipo de Usuario</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3} divider={<Divider />}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <HStack key={item} justify="space-between">
              <HStack spacing="4">
                <Avatar size="sm" />
                <VStack align="left" spacing="0">
                  <Text fontSize="md">User Name</Text>
                </VStack>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
