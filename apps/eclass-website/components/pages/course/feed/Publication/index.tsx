import {
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Heading,
  Textarea,
  useBoolean,
} from "@chakra-ui/react";
import { ChatIcon, StarIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";

export const Publication = () => {
  const [showComments, setShowcomment] = useBoolean();

  return (
    <Card>
      <CardHeader>
        <HStack spacing="2">
          <Avatar size="sm" />
          <Text fontSize="xl">User Name</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisl eget consectetur sagittis, nisl nunc euismod nisi, a
            porttitor nisi nisi euismod nisi.
          </Text>
          <HStack spacing={3}>
            <HStack
              spacing={1}
              align="center"
              as="button"
              onClick={setShowcomment.toggle}
            >
              <ChatIcon />
              <Text fontSize="sm">X recomendados</Text>
            </HStack>
            <HStack spacing={1} align="center" as="button">
              <StarIcon />
              <Text fontSize="sm">X comentarios</Text>
            </HStack>
          </HStack>
          <Divider />
          {showComments && (
            <>
              {[...Array(3)].map((i) => (
                <Card baseColor="light" shadow={false} key={i}>
                  <CardBody>
                    <HStack align="top">
                      <Avatar size="sm" />
                      <VStack align="left" spacing={1}>
                        <Heading size="md">Skylar Kenter</Heading>
                        <Text>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec euismod, nisl eget consectetur sagittis,
                          nisl nunc euismod nisi, a porttitor nisi nisi euismod
                          nisi. Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Donec euismod, nisl eget consectetur
                          sagittis, nisl nunc euismod nisi, a porttitor nisi
                          nisi euismod nisi. Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit.
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
              <Divider />
            </>
          )}
          <Textarea
            borderColor="teal.400"
            focusBorderColor="teal.200"
            borderRadius="2xl"
            placeholder="Comentar..."
          />
        </VStack>
      </CardBody>
    </Card>
  );
};
