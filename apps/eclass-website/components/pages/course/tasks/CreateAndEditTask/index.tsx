import { ModalForm } from "../../../../ModalForm";
import { Grid } from "@chakra-ui/react";
import { GridItemInput } from "../../../../Forms/common/GridItemInput";
import { Task } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  taskToEdit?: Task | null;
}

export const CreateAndEditTask = ({
  isOpen,
  onClose,
  handleSubmit,
  taskToEdit,
}: Props) => {
  return (
    <ModalForm
      size="xl"
      header={taskToEdit ? "Editar tarea" : "Crear tarea"}
      submit={taskToEdit ? "Editar" : "Crear"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Grid gap={2} w="100%">
        <GridItemInput
          size="sm"
          label="Nombre"
          name="name"
          colSpan={12}
          defaultValue={taskToEdit?.name || ""}
        />
        <GridItemInput
          size="sm"
          label="Descripción"
          name="description"
          colSpan={12}
          defaultValue={taskToEdit?.description || ""}
        />
        <GridItemInput
          size="sm"
          label="Fecha de inicio"
          name="dateStart"
          colSpan={6}
          type="date"
          defaultValue={
            // @ts-ignore
            taskToEdit?.dateStart?.substring(0, 10) ||
            new Date().toISOString().substring(0, 10)
          }
        />
        <GridItemInput
          size="sm"
          label="Fecha de fin"
          name="dateEnd"
          colSpan={6}
          type="date"
          defaultValue={
            // @ts-ignore
            taskToEdit?.dateEnd?.substring(0, 10) ||
            new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .substring(0, 10)
          }
        />
      </Grid>
    </ModalForm>
  );
};
