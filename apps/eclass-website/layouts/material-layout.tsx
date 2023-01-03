import { useState } from "react";
import { InstitutionLayout } from "./institution-layout";
import { BaseLayoutProps } from "./base-layout";
import {
  GridItem,
  HStack,
  VStack,
  Divider,
  Text,
  Button,
  Badge,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader } from "../components/Card";
import { AddIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { GridContainer } from "../components/GridContainer";
import { FolderModal } from "../components/pages/material/FolderModal";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useQueryClient } from "react-query";
import { FileUploader } from "../components/pages/material/FileUploader";
import { formatBytes } from "../utils/formatBytes";
import { Folder } from "@prisma/client";
import { FolderCard } from "../components/pages/material/FolderCard";
import { AssignFile } from "../components/pages/material/AssignFile";

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

  const [editFolder, setEditFolder] = useState<Folder | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const currentFolder = me?.folders?.find(
    (folder) => folder.id === pathname.split("/")[2]
  );

  const handleModalClose = () => {
    onCloseCreateFolder();
    setEditFolder(null);
  };

  const handleRemoveFile = async (id: string) => {
    const result = await fetch(`/api/v1/file/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await result.json();

    toast({
      title: data.success ? "Archivo eliminado" : "Error",
      description: data.success ? "Archivo eliminado con éxito" : data.message,
      status: data.success ? "success" : "error",

      isClosable: true,
    });

    if (data.success) {
      queryClient.invalidateQueries("current-user");
    }
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
            {me?.folders && me.folders.length > 0 ? (
              <>
                {me?.folders?.map((folder, i) => (
                  <GridItem key={i} colSpan={[12, 6, 6, 3]}>
                    <FolderCard
                      folder={folder}
                      isCurrent={currentFolder?.id === folder.id}
                      setEditFolder={setEditFolder}
                      onOpenCreateFolder={onOpenCreateFolder}
                    />
                  </GridItem>
                ))}
              </>
            ) : (
              <GridItem colSpan={12}>
                <Text color={"gray.500"}>
                  No tienes ninguna carpeta, presione el boton de{" "}
                  <b>añadir carpeta</b> para comenzar a subir tus archivos.
                </Text>
              </GridItem>
            )}
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
                            <VStack align="left" spacing="0">
                              <Text fontWeight="bold" fontSize="md">
                                {file.title}
                              </Text>
                              <Text fontSize="sm" textTransform="uppercase">
                                <Badge colorScheme="blue" mr="2">
                                  {file.format}
                                </Badge>
                                <Badge colorScheme="yellow">
                                  {formatBytes(file.size)}
                                </Badge>
                              </Text>
                            </VStack>
                            <HStack spacing="4">
                              <Button
                                colorScheme="red"
                                size="sm"
                                variant="outline"
                                leftIcon={<DeleteIcon />}
                                onClick={() => handleRemoveFile(file.id)}
                              >
                                Eliminar
                              </Button>
                              <Button
                                variant="outline"
                                colorScheme="blue"
                                as="a"
                                href={file.link}
                                target="_blank"
                                size="sm"
                                leftIcon={<DownloadIcon />}
                              >
                                Descargar
                              </Button>
                              <AssignFile file={file} />\
                            </HStack>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text color={"gray.500"}>
                        No hay archivos en esta carpeta.
                      </Text>
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
