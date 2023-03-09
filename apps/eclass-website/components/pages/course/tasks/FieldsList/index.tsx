import { Text, VStack, HStack, Button, Divider } from "@chakra-ui/react";
import { Field, Task } from "@prisma/client";
import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  IconButton,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export const FieldsList = ({
  task,
  onDelete,
  onEdit,
}: {
  task: any;
  onDelete: (id: string) => void;
  onEdit: (field: Field) => void;
}) => {
  return (
    <VStack align="left" spacing={3} divider={<Divider />}>
      {task.fields.map((field: any, index: number) => (
        <HStack key={index} justify="space-between" w="100%">
          <VStack align="left">
            <HStack>
              <Text fontWeight="bold" fontSize="md">
                {field.question}
              </Text>
              {(field.type === "multiple-choice" ||
                field.type === "truth-or-false") && (
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Mas info"
                      icon={<InfoIcon />}
                      rounded="full"
                      size="xs"
                      variant="ghost"
                    />
                  </PopoverTrigger>
                  <PopoverContent w="fit-content">
                    <PopoverHeader fontWeight="semibold">
                      Datos de la pregunta
                    </PopoverHeader>
                    <PopoverBody>
                      <VStack align="left" spacing={0}>
                        {field.type === "multiple-choice" && (
                          <HStack>
                            <Text
                              fontSize="sm"
                              color="gray.900"
                              whiteSpace="nowrap"
                            >
                              Opciones:
                            </Text>

                            {field.possibleAnswers
                              .split(",")
                              .map((answer: string, index: number) => (
                                <Badge colorScheme="gray" key={index}>
                                  {answer}
                                </Badge>
                              ))}
                          </HStack>
                        )}

                        {(field.type === "multiple-choice" ||
                          field.type === "truth-or-false") && (
                          <HStack>
                            <Text fontSize="sm" color="gray.900">
                              Respuesta Correcta:
                            </Text>

                            <Badge
                              colorScheme={
                                field.type === "multiple-choice"
                                  ? "green"
                                  : field.correctAnswer.toLowerCase() === "v"
                                  ? "green"
                                  : "red"
                              }
                            >
                              {field.correctAnswer}
                            </Badge>
                          </HStack>
                        )}
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </HStack>

            <HStack>
              <Badge
                colorScheme={
                  field.type === "text"
                    ? "orange"
                    : field.type === "multiple-choice"
                    ? "blue"
                    : field.type === "truth-or-false"
                    ? "purple"
                    : "gray"
                }
                width="fit-content"
              >
                Tipo:{" "}
                {field.type === "text"
                  ? "Pregunta abierta"
                  : field.type === "multiple-choice"
                  ? "Seleccionar la opción correcta"
                  : field.type === "truth-or-false"
                  ? "Verdadero o Falso"
                  : "Desconocido"}
              </Badge>
              <Badge colorScheme="teal" width="fit-content">
                Puntaje: {field.value}
              </Badge>
            </HStack>
          </VStack>
          <HStack spacing="4">
            <Button
              colorScheme="red"
              size="sm"
              variant="outline"
              leftIcon={<DeleteIcon />}
              onClick={() => onDelete(field.id)}
            >
              Eliminar
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              // @ts-ignore
              target="_blank"
              size="sm"
              leftIcon={<EditIcon />}
              onClick={() => onEdit(field)}
            >
              Editar
            </Button>
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
};
