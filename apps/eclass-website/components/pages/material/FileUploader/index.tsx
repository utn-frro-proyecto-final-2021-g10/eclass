import { useRef } from "react";
import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useBoolean,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { getFormValues } from "../../../../utils/getFormValues";
import { AddIcon } from "@chakra-ui/icons";
import { useQueryClient } from "react-query";

interface FileUploaderProps {
  folderId: string | undefined;
  color?: string;
}

export const FileUploader = ({ folderId, color }: FileUploaderProps) => {
  const [modalOpen, setModalOpen] = useBoolean();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useBoolean();

  const handleUploadFile = async () => {
    setLoading.on();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const values = getFormValues(data);

    if (values.image.size === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar un archivo",
        status: "error",
        isClosable: true,
      });
      setLoading.off();
      return;
    }

    if (values.title.length === 0) {
      toast({
        title: "Error",
        description: "Debes darle un nombre al archivo",
        status: "error",
        isClosable: true,
      });
      setLoading.off();
      return;
    }

    const formData = new FormData();
    formData.append("image", values.image);

    const result = await fetch(`/api/v1/cloudinary/upload?folder=files`, {
      method: "PUT",
      body: formData,
    });

    if (result.status === 200) {
      const { filepath, format } = await result.json();

      const r = await fetch("/api/v1/file", {
        method: "POST",
        body: JSON.stringify({
          link: filepath,
          folderId,
          format,
          title: values.title,
          size: values.image.size,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await r.json();

      if (data.success) {
        queryClient.invalidateQueries("current-user");
        toast({
          title: "Archivo subido con éxito",
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error al subir el archivo",
          status: "error",
          isClosable: true,
        });
      }

      setLoading.off();
    } else {
      toast({
        title: "Error",
        description: "Error al subir el archivo",
        status: "error",
        isClosable: true,
      });
      setLoading.off();
    }

    setModalOpen.off();
  };

  return (
    <>
      <Modal isOpen={modalOpen} onClose={setModalOpen.off}>
        <ModalOverlay />
        <ModalContent>
          <form autoComplete="off" ref={formRef}>
            <ModalHeader>Subir Archivo</ModalHeader>
            <ModalBody>
              <FormControl isRequired mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input name="title" />
              </FormControl>
              <input required name="image" type="file" />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={setModalOpen.off}>
                Cancelar
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleUploadFile}
                isLoading={loading}
              >
                Subir
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Button
        colorScheme={color}
        size="xs"
        leftIcon={<AddIcon />}
        onClick={setModalOpen.on}
      >
        Añadir archivo
      </Button>
    </>
  );
};
