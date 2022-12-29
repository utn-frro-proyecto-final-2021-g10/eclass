import { ModalForm } from "../../ModalForm";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormToast } from "../../../hooks/useFormToast";
import { getFormValues } from "../../../utils/getFormValues";
import { useQueryClient } from "react-query";
import { AddIcon } from "@chakra-ui/icons";

export const Enrollment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useFormToast({
    successMessage: "Te has inscrito al curso con éxito",
  });
  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);
    const result = await fetch("/api/v1/course/enroll", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    showToast(data);
    //@ts-ignore
    e.target.reset();
    if (data.success) {
      onClose();
      queryClient.invalidateQueries("current-user");
    }
  };

  return (
    <>
      <IconButton
        position="fixed"
        bottom={7}
        right={7}
        zIndex={1}
        bg="gray.700"
        color="white"
        sx={{
          "&:hover": {
            bg: "gray.800",
          },
        }}
        aria-label="Inscribirse a un curso"
        variant="outline"
        w={16}
        h={16}
        borderRadius="full"
        icon={<AddIcon />}
        onClick={onOpen}
      />
      <ModalForm
        onSubmit={handleSubmit}
        header={"Inscribirse a un curso"}
        submit="Inscribirse"
        isOpen={isOpen}
        onClose={onClose}
      >
        <FormControl>
          <FormLabel>Código de inscripción</FormLabel>
          <Input required name="enrollmentId" placeholder="FÍSICA-101" />
        </FormControl>
      </ModalForm>
    </>
  );
};
