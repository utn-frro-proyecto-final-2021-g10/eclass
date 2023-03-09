import { useRef } from "react";
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
import { Dispatch, SetStateAction } from "react";
import { getFormValues } from "../../../utils/getFormValues";

interface ImageUploaderProps {
  imageUrl?: string;
  setImageUrl: Dispatch<SetStateAction<any>>;
}

export const ImageUploader = ({
  imageUrl,
  setImageUrl,
}: ImageUploaderProps) => {
  const [modalOpen, setModalOpen] = useBoolean();
  const [loading, setLoading] = useBoolean();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleUploadImage = async () => {
    setLoading.on();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const values = getFormValues(data);

    const formData = new FormData();
    formData.append("image", values.image);

    const result = await fetch(
      `/api/v1/cloudinary/upload?folder=novelty-images`,
      {
        method: "PUT",
        body: formData,
      }
    );

    setModalOpen.off();

    if (result.status === 200) {
      const { filepath } = await result.json();

      setImageUrl(filepath);
    } else {
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        status: "error",
        isClosable: true,
      });
    }
    setLoading.off();
  };

  return (
    <>
      <Modal isOpen={modalOpen} onClose={setModalOpen.off}>
        <ModalOverlay />
        <ModalContent>
          <form autoComplete="off" ref={formRef}>
            <ModalHeader>Añadir imagen</ModalHeader>
            <ModalBody>
              <input required name="image" type="file" />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={setModalOpen.off}>
                Cancelar
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleUploadImage}
                isLoading={loading}
              >
                Añadir imagen
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Box
        position="relative"
        h={"224"}
        w={"100%"}
        borderRadius="lg"
        border={"1px solid"}
        borderColor={"gray.200"}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            h={"224"}
            w={"100%"}
            p={2}
            objectFit="contain"
          />
        )}
        <Button
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          onClick={setModalOpen.on}
          colorScheme={"gray"}
        >
          Añadir imagen
        </Button>
      </Box>
    </>
  );
};
