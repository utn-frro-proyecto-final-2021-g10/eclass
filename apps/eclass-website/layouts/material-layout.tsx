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
  Button,
  Badge,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader } from "../components/Card";
import {
  AttachmentIcon,
  AddIcon,
  DragHandleIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { GridContainer } from "../components/GridContainer";

const adminLinks = [
  {
    title: "Física I",
    description: "Agrega o edita o elimina la información de la institución",
    href: "/material/fisica-1",
    color: "red",
  },
  {
    title: "Física II",
    description: "Agrega, edita o elimina novedades",
    href: "/material/fisica-2",
    color: "purple",
  },
  {
    title: "Información Útil",
    description: "Agrega, edita o elimina usuarios",
    href: "/material/informacion-util",
    color: "orange",
  },
  {
    title: "Otros",
    description: "Agrega, edita o elimina cursos",
    href: "/material/otros",
    color: "blue",
  },
];

interface AdminLayoutProps extends BaseLayoutProps {
  hideDetails?: boolean;
}

export const MaterialLayout = ({ children, hideDetails }: AdminLayoutProps) => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const currentLink = adminLinks.find((link) => link.href === pathname);

  return (
    <InstitutionLayout>
      <VStack spacing={8} w="100%" align="stretch">
        <GridContainer>
          <GridItem colSpan={12}>
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="bold" color={"gray.00"}>
                Carpetas
              </Text>
              <Button
                colorScheme="gray"
                variant="outline"
                size="sm"
                leftIcon={<AddIcon />}
              >
                Añadir carpeta
              </Button>
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
                      <HStack justify="space-between" w="100%">
                        <Heading
                          fontWeight="400"
                          color={
                            currentLink?.title === link.title
                              ? `${link.color}.900`
                              : `${link.color}.700`
                          }
                          size="md"
                        >
                          {link.title}
                        </Heading>
                        <Menu placement="top-start">
                          <MenuButton
                            transform="translate(50%, -40%)"
                            as={IconButton}
                            size="sm"
                            _focus={{
                              outline: "none",
                            }}
                            icon={
                              <DragHandleIcon
                                color={
                                  currentLink?.title === link.title
                                    ? `${link.color}.900`
                                    : `${link.color}.700`
                                }
                              />
                            }
                            variant="unstyled"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <MenuList color={`gray.900`}>
                            <MenuItem icon={<EditIcon />}>Editar</MenuItem>
                            <MenuItem icon={<DeleteIcon />}>Eliminar</MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                      <Heading
                        fontWeight="300"
                        color={
                          currentLink?.title === link.title
                            ? `${link.color}.700`
                            : `${link.color}.500`
                        }
                        textTransform="uppercase"
                        fontSize="xs"
                      >
                        x elementos
                      </Heading>
                      <HStack justify="flex-end" w="100%">
                        <AttachmentIcon
                          color={
                            currentLink?.title === link.title
                              ? `${link.color}.400`
                              : `${link.color}.200`
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

        {(!hideDetails || true) && (
          <GridContainer>
            <GridItem colSpan={12} pb={3}>
              <Divider />
            </GridItem>
            <GridItem colSpan={[12, 12, 12, 12]}>
              <Card w={"100%"} baseColor={currentLink?.color}>
                <CardHeader>
                  <HStack spacing="2" justify="space-between">
                    <HStack spacing="2">
                      <Text fontSize="xl"> {currentLink?.title}</Text>
                    </HStack>
                    <Badge colorScheme={currentLink?.color}>x elementos</Badge>
                  </HStack>
                </CardHeader>
                <CardBody my={8}>{children}</CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        )}
      </VStack>
    </InstitutionLayout>
  );
};
