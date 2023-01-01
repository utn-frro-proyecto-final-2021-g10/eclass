import { useState } from "react";
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
  Avatar,
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
import { FolderModal } from "../components/pages/material/FolderModal";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { FileUploader } from "../components/pages/material/FileUploader";

interface MaterialLayoutProps extends BaseLayoutProps {
  hideDetails?: boolean;
}

export const MaterialLayout = ({ hideDetails }: MaterialLayoutProps) => {
  const me = useCurrentUser();
  const {
    onOpen: onOpenCreateFolder,
    isOpen: isOpenCreateFolder,
    onClose: onCloseCreateFolder,
  } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editFolder, setEditFolder] = useState<Folder | null>(null);

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

    toast({
      title: data.success ? "Carpeta eliminada" : "Error",
      description: data.success ? "Carpeta eliminada con éxito" : data.message,
      status: data.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (data.success) {
      queryClient.invalidateQueries("current-user");
      if (pathname === `/material/${id}`) {
        router.replace("/material");
      }
    }
  };

  const handleModalClose = () => {
    onCloseCreateFolder();
    setEditFolder(null);
  };

  return (
    <>
      <FolderModal
        isOpen={isOpenCreateFolder}
        onClose={handleModalClose}
        folder={editFolder}
      />
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
                            textTransform="capitalize"
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
                              <MenuItem
                                icon={<EditIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditFolder(folder);
                                  onOpenCreateFolder();
                                }}
                              >
                                Editar
                              </MenuItem>
                              <MenuItem
                                icon={<DeleteIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(folder.id);
                                }}
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
                          {folder.files?.length}{" "}
                          {folder.files?.length === 1
                            ? "elemento"
                            : "elementos"}
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
                      <HStack spacing="4">
                        <Text fontSize="xl" textTransform="capitalize">
                          {currentFolder?.title}
                        </Text>
                        <FileUploader
                          folderId={currentFolder?.id}
                          color={currentFolder?.color}
                        />
                      </HStack>
                      <Badge colorScheme={currentFolder?.color}>
                        {currentFolder?.files?.length}{" "}
                        {currentFolder?.files?.length === 1
                          ? "elemento"
                          : "elementos"}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    {currentFolder?.files?.length > 0 ? (
                      <VStack align="left" spacing={3} divider={<Divider />}>
                        {currentFolder?.files.map((file, i) => (
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
                            <HStack spacing="4">
                              <Button
                                variant="outline"
                                as="a"
                                href={file.link}
                                target="_blank"
                              >
                                Descargar
                              </Button>
                              <Button colorScheme="green">Asignar</Button>
                            </HStack>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text>No hay archivos en esta carpeta</Text>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )}
        </VStack>
      </InstitutionLayout>
    </>
  );
};
