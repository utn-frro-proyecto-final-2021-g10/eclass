import * as React from "react";
import { InstitutionLayout } from "./institution-layout";
import { BaseLayoutProps } from "./base-layout";
import {
  GridItem,
  HStack,
  VStack,
  Heading,
  Divider,
  Text,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { EditIcon } from "@chakra-ui/icons";
import { GridContainer } from "../components/GridContainer";

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

interface AdminLayoutProps extends BaseLayoutProps {
  hideDetails?: boolean;
}

export const AdminLayout = ({ children, hideDetails }: AdminLayoutProps) => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const currentLink = adminLinks.find((link) => link.href === pathname);

  return (
    <InstitutionLayout>
      <VStack spacing={8} w="100%" align="stretch">
        <GridContainer>
          <GridItem colSpan={12}>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold" color={"gray.00"}>
                Administración
              </Text>
            </HStack>
          </GridItem>
          {adminLinks.map((link, i) => (
            <GridItem key={i} colSpan={[12, 6, 6, 3]}>
              <Card
                baseColor={link.color}
                variation={
                  currentLink?.title === link.title ? undefined : "light"
                }
                href={link.href}
              >
                <CardHeader>
                  <HStack spacing="2" w="100%" h="100%">
                    <VStack align="left" spacing="2" w="100%" h="100%">
                      <Heading
                        fontWeight={
                          currentLink?.title === link.title ? "bold" : 300
                        }
                        color={
                          currentLink?.title === link.title
                            ? `${link.color}.900`
                            : `${link.color}.700`
                        }
                        size="lg"
                      >
                        {link.title}
                      </Heading>
                      <HStack justify="flex-end" w="100%" py={3}>
                        <EditIcon
                          color={
                            currentLink?.title === link.title
                              ? `${link.color}.900`
                              : `${link.color}.300`
                          }
                          w={12}
                          h={12}
                        />
                      </HStack>
                    </VStack>
                  </HStack>
                </CardHeader>
              </Card>
            </GridItem>
          ))}
        </GridContainer>

        {!hideDetails && (
          <GridContainer>
            <GridItem colSpan={12} pb={3}>
              <Divider />
            </GridItem>
            <GridItem colSpan={[12, 12, 12, 12]}>
              <Card w={"100%"} baseColor={currentLink?.color}>
                <CardBody my="8">{children}</CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        )}
      </VStack>
    </InstitutionLayout>
  );
};
