import {
  HStack,
  VStack,
  Heading,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Card, CardHeader } from "../../Card";
import {
  AttachmentIcon,
  DragHandleIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { Folder } from "@prisma/client";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { formatBytes } from "../../../utils/formatBytes";

interface FolderCardProps {
  folder: Folder;
  isCurrent?: boolean;
  setEditFolder: (folder: Folder) => void;
  onOpenCreateFolder: () => void;
}

export const FolderCard = ({
  folder,
  isCurrent,
  setEditFolder,
  onOpenCreateFolder,
}: FolderCardProps) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

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

    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (data.success) {
      queryClient.invalidateQueries("current-user");
      if (pathname === `/material/${id}`) {
        router.replace("/material");
      }
    }
  };

  return (
    <Card
      baseColor={folder.color}
      variation={isCurrent ? undefined : "light"}
      href={`/material/${folder.id}`}
    >
      <CardHeader>
        <HStack spacing="2" w="100%" h="100%">
          <VStack align="left" spacing="2" w="100%" h="100%">
            <HStack justify="space-between" w="100%">
              <Heading
                fontWeight="400"
                color={
                  isCurrent ? `${folder.color}.900` : `${folder.color}.700`
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
                        isCurrent
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
              color={isCurrent ? `${folder.color}.700` : `${folder.color}.500`}
              textTransform="uppercase"
              fontSize="xs"
            >
              {folder.files?.length}
              {folder.files?.length === 1 ? " elemento" : " elementos"}
              <br />
              {folder.files?.reduce((acc, file) => acc + file.size, 0) > 0 ? (
                formatBytes(
                  folder.files?.reduce((acc, file) => acc + file.size, 0)
                )
              ) : (
                <br />
              )}
            </Heading>
            <HStack justify="flex-end" w="100%">
              <AttachmentIcon
                color={
                  isCurrent ? `${folder.color}.400` : `${folder.color}.200`
                }
                w={12}
                h={12}
              />
            </HStack>
          </VStack>
        </HStack>
      </CardHeader>
    </Card>
  );
};
