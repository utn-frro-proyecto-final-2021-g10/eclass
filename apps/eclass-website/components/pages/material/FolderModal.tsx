import { ModalForm } from "../../ModalForm";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useFormToast } from "../../../hooks/useFormToast";
import { getFormValues } from "../../../utils/getFormValues";
import { useQueryClient } from "react-query";
import { Color } from "@prisma/client";

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: any;
}

export const FolderModal = ({
  isOpen,
  onClose,
  folder,
}: FolderModalProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useFormToast({
    successMessage: "Carpeta creada con éxito",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    const result = await fetch(
      folder ? `/api/v1/folder/${folder.id}` : "/api/v1/folder",
      {
        method: folder ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await result.json();
    showToast(data);

    //@ts-ignore
    e.target.reset();
    if (true || data.success) {
      onClose();
      queryClient.invalidateQueries("current-user");
    }
  };

  return (
    <>
      <ModalForm
        onSubmit={handleSubmit}
        header={folder ? "Editar carpeta" : "Crear carpeta"}
        submit={folder ? "Editar" : "Crear"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <FormControl mb={4}>
          <FormLabel>Nombre</FormLabel>
          <Input
            required
            name="title"
            placeholder="Física I"
            defaultValue={folder?.title}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Color</FormLabel>
          <Select name="color" defaultValue={folder?.color || Color.blue}>
            <option value={Color.blue}>{Color.blue}</option>
            <option value={Color.green}>{Color.green}</option>
            <option value={Color.orange}>{Color.orange}</option>
            <option value={Color.pink}>{Color.pink}</option>
            <option value={Color.purple}>{Color.purple}</option>
            <option value={Color.red}>{Color.red}</option>
            <option value={Color.yellow}>{Color.yellow}</option>
          </Select>
        </FormControl>
      </ModalForm>
    </>
  );
};
