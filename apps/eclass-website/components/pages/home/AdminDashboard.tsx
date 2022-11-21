import {
  GridItem,
  AspectRatio,
  HStack,
  VStack,
  Heading,
  Text
} from "@chakra-ui/react";
import { GridContainer } from "../../GridContainer";
import { Card, CardHeader } from "../../Card";
import { EditIcon } from "@chakra-ui/icons";

const adminLinks = [
  {
    title: "Institución",
    description: "Agrega o edita o elimina la información de la institución",
    href: "/admin/institution",
    color: "red",
  },
  {
    title: "Novedades",
    description: "Agrega, edita o elimina novedades",
    href: "/admin/novelties",
    color: "purple",
  },
  {
    title: "Usuarios",
    description: "Agrega, edita o elimina usuarios",
    href: "/admin/users",
    color: "yellow",
  },
  {
    title: "Cursos",
    description: "Agrega, edita o elimina cursos",
    href: "/admin/courses",
    color: "blue",
  },
];

export const AdminDashboard = () => {
  return (
    <GridContainer>
      <GridItem colSpan={12}>
        <HStack>
          <Text fontSize="2xl" fontWeight="bold" color={"gray.700"}>
            Administración
          </Text>
        </HStack>
      </GridItem>
      {adminLinks.map((link, i) => (
        <GridItem key={i} colSpan={[12, 6, 4, 3]}>
          <Card baseColor={link.color} variation="light" href={link.href}>
            <CardHeader>
              <HStack spacing="2" w="100%" h="100%">
                <VStack align="left" spacing="2" w="100%" h="100%">
                  <Heading
                    fontWeight={300}
                    color={`${link.color}.700`}
                    size="lg"
                  >
                    {link.title}
                  </Heading>

                  <HStack justify="flex-end" w="100%" py={3}>
                    <EditIcon color={`${link.color}.300`} w={12} h={12} />
                  </HStack>
                </VStack>
              </HStack>
            </CardHeader>
          </Card>
        </GridItem>
      ))}
    </GridContainer>
  );
};
