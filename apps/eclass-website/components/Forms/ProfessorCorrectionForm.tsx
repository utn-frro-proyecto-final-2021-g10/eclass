import React, { useState } from "react";
import {
  Input,
  HStack,
  useDisclosure,
  Badge,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Thead,
  VStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader } from "../Card";
import { ModalForm } from "../ModalForm";
import { GridItemInput } from "./common/GridItemInput";

interface Props {
  task: any;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleAutoCorrection: (e: any, formName: string) => Promise<void>;
}
const ProfessorCorrectionForm = ({
  handleSubmit,
  handleAutoCorrection,
  task,
}: Props) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [userToCorrect, setUserToCorrect] = useState<any>(null);

  const handleCorrection = (user: any) => {
    setUserToCorrect(user);
    onOpen();
  };

  const handleSubmitFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    onClose();
  };

  return (
    <Card>
      <CardHeader>
        <Text fontSize="xl">Estudiantes</Text>
      </CardHeader>

      <CardBody>
        {userToCorrect && (
          <CorrectionModal
            size="7xl"
            header="Corregir tarea"
            submit={"Corregir"}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmitFunction}
            handleAutoCorrection={handleAutoCorrection}
            answer={userToCorrect}
          />
        )}

        <VStack
          w="100%"
          spacing={2}
          alignItems="flex-start"
          divider={<Divider />}
        >
          {task.answers.map((answer: any, index: number) => (
            <HStack
              key={index}
              w="100%"
              spacing={4}
              justifyContent="space-between"
            >
              <Text w="fit-content">
                {answer?.user.firstName} {answer?.user.lastName}
              </Text>
              <Button
                size="sm"
                colorScheme="yellow"
                onClick={(e) => handleCorrection(answer)}
              >
                Corregir
              </Button>
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

const CorrectionModal = ({
  size,
  header,
  submit,
  isOpen,
  onClose,
  onSubmit,
  handleAutoCorrection,
  answer,
}: any) => {
  const index = answer?.index;

  return (
    <ModalForm
      size={size}
      header={header}
      submit={submit}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      name={`form-${index}`}
      extraAction={
        <Button
          colorScheme="yellow"
          onClick={(e) => handleAutoCorrection(e, `form-${index}`)}
          mr={3}
        >
          Autocorrección
        </Button>
      }
    >
      <Table>
        <Thead>
          <Tr>
            <Th>Pregunta</Th>
            <Th>Respuesta</Th>
            <Th>Respuesta esperada</Th>
            <Th>Puntaje Máximo</Th>
            <Th>Puntaje</Th>
          </Tr>
        </Thead>
        <Tbody>
          {answer.fields.map((field: any) => (
            <Tr key={field.id}>
              <Td>{field.question}</Td>
              <Td>
                {field.studentAnswer}{" "}
                <GridItemInput
                  isRequired={false}
                  name={field.id}
                  defaultValue={field.studentAnswer}
                  disabled
                  // @ts-ignore
                  display="none"
                  label={field.question}
                  colSpan={10}
                />
              </Td>
              <Td>{field.correctAnswer}</Td>
              <Td>{field.value}</Td>
              <Td>
                <GridItemInput
                  name={`${field.id}-qualification`}
                  defaultValue={field?.qualification}
                  max={field.value}
                  min={0}
                  colSpan={2}
                  type="number"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text fontSize="xl" my={4}>
        Puntaje total:{" "}
        <Badge colorScheme="blue" fontSize="xl">
          {answer.fields.reduce((acc: number, field: any) => {
            return acc + field?.qualification;
          }, 0)}
        </Badge>{" "}
        /{" "}
        <Badge colorScheme="green" fontSize="xl">
          {answer.fields.reduce((acc: number, field: any) => {
            return acc + field.value;
          }, 0)}
        </Badge>
      </Text>
      <Divider />

      <Input
        display="none"
        readOnly={true}
        name="studentId"
        value={answer.userId}
      />
    </ModalForm>
  );
};

export default ProfessorCorrectionForm;
