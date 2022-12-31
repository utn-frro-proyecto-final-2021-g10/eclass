import {
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Button,
  Badge,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";

export const MaterialList = () => {
  return (
    <Card>
      <CardHeader>
        <HStack spacing="2" justify="space-between">
          <Text fontSize="xl">Material</Text>
          <Badge colorScheme="teal">
            x elementos
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3} divider={<Divider />}>
          {[...Array(6)].map((i) => (
            <HStack key={i} justify="space-between">
              <HStack spacing="4">
                <Avatar size="sm" />
                <VStack align="left" spacing="0">
                  <Text fontWeight="bold" fontSize="md">
                    Nombre del archivo
                  </Text>
                  <Text fontSize="sm">PDF</Text>
                </VStack>
              </HStack>
              <Button rightIcon={<ExternalLinkIcon />}>ABRIR</Button>
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
