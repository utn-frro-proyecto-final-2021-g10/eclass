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
  useDisclosure,
  useToast,
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
import { CreateFolder } from "../components/pages/material/CreateFolder";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

interface MaterialLayoutProps extends BaseLayoutProps {
  hideDetails?: boolean;
}

export const MaterialLayout = ({
  children,
  hideDetails,
}: MaterialLayoutProps) => {
  const me = useCurrentUser();
  const {
    onOpen: onOpenCreateFolder,
    isOpen: isOpenCreateFolder,
    onClose: onCloseCreateFolder,
  } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const currentFolder = me?.folders?.find(
    (folder) => folder.id === pathname.split("/")[2]
  );

  const handleRemove = async (id: string) => {
    const result = await fetch(`/api/v1/folder/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await result.json();

    if (data.success) {
      toast({
        title: "Carpeta eliminada",
        description: "La carpeta se ha eliminado con éxito",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries("current-user");
      router.replace("/material");
    }
  };

  return (
    <>
      <CreateFolder isOpen={isOpenCreateFolder} onClose={onCloseCreateFolder} />
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
                  onClick={onOpenCreateFolder}
                >
                  Añadir carpeta
                </Button>
              </HStack>
            </GridItem>
            {me?.folders?.map((folder, i) => (
              <GridItem key={i} colSpan={[12, 6, 6, 3]}>
                <Card
                  baseColor={folder.color}
                  variation={
                    currentFolder?.id === folder.id ? undefined : "light"
                  }
                  href={`/material/${folder.id}`}
                >
                  <CardHeader>
                    <HStack spacing="2" w="100%" h="100%">
                      <VStack align="left" spacing="2" w="100%" h="100%">
                        <HStack justify="space-between" w="100%">
                          <Heading
                            fontWeight="400"
                            color={
                              currentFolder?.id === folder.id
                                ? `${folder.color}.900`
                                : `${folder.color}.700`
                            }
                            size="md"
                          >
                            {folder.title}
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
                                    currentFolder?.id === folder.id
                                      ? `${folder.color}.900`
                                      : `${folder.color}.700`
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
                              <MenuItem
                                icon={<DeleteIcon />}
                                onClick={() => handleRemove(folder.id)}
                              >
                                Eliminar
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                        <Heading
                          fontWeight="300"
                          color={
                            currentFolder?.id === folder.id
                              ? `${folder.color}.700`
                              : `${folder.color}.500`
                          }
                          textTransform="uppercase"
                          fontSize="xs"
                        >
                          x elementos
                        </Heading>
                        <HStack justify="flex-end" w="100%">
                          <AttachmentIcon
                            color={
                              currentFolder?.id === folder.id
                                ? `${folder.color}.400`
                                : `${folder.color}.200`
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
                <Card w={"100%"} baseColor={currentFolder?.color}>
                  <CardHeader>
                    <HStack spacing="2" justify="space-between">
                      <HStack spacing="2">
                        <Text fontSize="xl"> {currentFolder?.title}</Text>
                      </HStack>
                      <Badge colorScheme={currentFolder?.color}>
                        x elementos
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody my={8}>{children}</CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )}
        </VStack>
      </InstitutionLayout>
    </>
  );
};
