import {
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { File } from "@prisma/client";
import { formatBytes } from "../../../../../utils/formatBytes";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";
import { useQueryClient } from "react-query";

interface MaterialListProps {
  files: File[];
  courseId: string;
}

export const MaterialList = ({ files, courseId }: MaterialListProps) => {
  const me = useCurrentUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleRemoveFile = async (file: any) => {
    const result = await fetch(`/api/v1/file/${file.fileId}/unassign`, {
      method: "POST",
      body: JSON.stringify({
        course: courseId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Archivo removido con éxito" : "Error",
      description: success
        ? "El archivo ha sido removido con éxito"
        : "Error al remover el archivo",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-user");
      queryClient.invalidateQueries("current-course");
    }
  };

  return (
    <Card>
      <CardHeader>
        <HStack spacing="2" justify="space-between">
          <Text fontSize="xl">Material</Text>
          <Badge colorScheme="teal">
            {files.length}
            {files.length === 1 ? " archivo" : " archivos"}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3} divider={<Divider />}>
          {files.map((file: any, i: number) => (
            <HStack key={i} justify="space-between">
              <VStack align="left" spacing="0">
                <Text fontWeight="bold" fontSize="md">
                  {file.file.title}
                </Text>
                <Text fontSize="sm" textTransform="uppercase">
                  <Badge colorScheme="purple" my="1">
                    de: {file.file.folder.professor.firstName}{" "}
                    {file.file.folder.professor.lastName}
                  </Badge>
                  <br />
                  <Badge colorScheme="blue" mr="2">
                    {file.file.format}
                  </Badge>
                  <Badge colorScheme="yellow">
                    {formatBytes(file.file.size)}
                  </Badge>
                </Text>
              </VStack>
              <HStack spacing="4">
                {me?.role === "professor" && (
                  <Button
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<DeleteIcon />}
                    onClick={() => handleRemoveFile(file)}
                  >
                    Eliminar
                  </Button>
                )}
                <Button
                  variant="outline"
                  colorScheme="blue"
                  as="a"
                  href={file.file.link}
                  target="_blank"
                  leftIcon={<DownloadIcon />}
                >
                  Descargar
                </Button>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
