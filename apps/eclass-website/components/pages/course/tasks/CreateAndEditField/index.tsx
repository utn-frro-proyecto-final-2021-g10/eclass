import { ModalForm } from "../../../../ModalForm";
import { Grid } from "@chakra-ui/react";
import { GridItemInput } from "../../../../Forms/common/GridItemInput";

import { useEffect, useState } from "react";
import { Field } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  fieldToEdit?: Field;
}

export const CreateAndEditField = ({
  isOpen,
  onClose,
  handleSubmit,
  fieldToEdit,
}: Props) => {
  const [questionType, setQuestionType] = useState("text");

  useEffect(() => {
    if (fieldToEdit) {
      setQuestionType(fieldToEdit.type);
    }
  }, [fieldToEdit]);

  return (
    <ModalForm
      size="xl"
      header={fieldToEdit ? "Editar pregunta" : "Añadir pregunta"}
      submit={fieldToEdit ? "Editar" : "Añadir"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Grid gap={2} w="100%">
        <GridItemInput
          size="sm"
          type="select"
          label="Tipo de campo"
          name="type"
          colSpan={8}
          options={[
            { value: "text", label: "Pregunta Abierta" },
            { value: "multiple-choice", label: "Opción correcta" },
            { value: "truth-or-false", label: "Verdadero - falso" },
          ]}
          onChange={(e) => setQuestionType(e.target.value)}
          defaultValue={fieldToEdit?.type}
        />

        <GridItemInput
          size="sm"
          label="Puntaje"
          name="value"
          colSpan={4}
          type="number"
          defaultValue={(fieldToEdit?.value || 0).toString()}
        />
        <GridItemInput
          size="sm"
          label="Enunciado"
          name="question"
          colSpan={12}
          defaultValue={fieldToEdit?.question || ""}
        />
        {questionType === "multiple-choice" && (
          <GridItemInput
            size="sm"
            label="Opciones"
            name="possibleAnswers"
            placeholder="Lista separada por comas de opciones posibles (a, b, c, d,...)"
            colSpan={12}
            defaultValue={fieldToEdit?.possibleAnswers || ""}
          />
        )}
        {questionType === "multiple-choice" ||
        questionType === "truth-or-false" ? (
          <GridItemInput
            size="sm"
            label="Respuesta correcta"
            name="correctAnswer"
            colSpan={12}
            defaultValue={fieldToEdit?.correctAnswer || ""}
          />
        ) : null}
        {fieldToEdit && (
          <GridItemInput
            display="none"
            size="sm"
            label="Id"
            name="id"
            colSpan={12}
            defaultValue={fieldToEdit?.id || ""}
          />
        )}
      </Grid>
    </ModalForm>
  );
};
