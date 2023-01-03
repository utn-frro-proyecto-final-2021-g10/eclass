import { Text, VStack, HStack, Divider, Button, Badge } from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { File } from "@prisma/client";
import { formatBytes } from "../../../../../utils/formatBytes";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";

interface MaterialListProps {
  files: File[];
}

export const MaterialList = ({ files }: MaterialListProps) => {
  const handleRemoveFile = async (id: string) => {};
  const me = useCurrentUser();

  console.log(files);

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
          {files.map((file, i) => (
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
                    onClick={() => handleRemoveFile(file.id)}
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
