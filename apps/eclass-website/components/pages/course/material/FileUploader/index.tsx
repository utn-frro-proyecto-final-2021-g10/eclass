import { useRef, useState } from "react";
import {
  useToast,
  Box,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useBoolean,
} from "@chakra-ui/react";

import { getFormValues } from "../../../../../utils/getFormValues";
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


  const handleUploadImage = async () => {
    const form = formRef.current;

    const data = new FormData(form);
    const values = getFormValues(data);

    const formData = new FormData();
    formData.append("image", values.image);

    const result = await fetch(`/api/v1/cloudinary/upload?folder=files`, {
      method: "PUT",
      body: formData,
    });

    setModalOpen.off();

    if (result.status === 200) {
      const { filepath } = await result.json();

      const r = await fetch("/api/v1/file", {
        method: "POST",
        body: JSON.stringify({
          link: filepath,
          folderId,
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
      }
    } else {
      toast({
        title: "Error",
        description: "Error al subir el archivo",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={modalOpen} onClose={setModalOpen.off}>
        <ModalOverlay />
        <ModalContent>
          <form autoComplete="off" ref={formRef}>
            <ModalHeader>Subir Archivo</ModalHeader>
            <ModalBody>
              <input required name="image" type="file" id="testing" />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={setModalOpen.off}>
                Cancelar
              </Button>
              <Button colorScheme="teal" onClick={handleUploadImage}>
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
