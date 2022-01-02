import { useRouter } from "next/router";
import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useFormToast } from "../../../hooks/useFormToast";
import { getFormValues } from "../../../utils/getFormValues";

export const Enrollment = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useFormToast({
    successMessage: "Successfully enrolled",
  });

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
      // TODO: use react-query and invalidate instead of reloading
      router.reload();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Enroll in a course</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>Enrollment Code</FormLabel>
                <Input required name="enrollmentId" placeholder="PHYSICS-101" />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="teal" type="submit">
                Enroll
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

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
        aria-label="Enroll in a course"
        variant="outline"
        w={16}
        h={16}
        borderRadius="full"
        icon={<AddIcon />}
        onClick={onOpen}
      />
    </>
  );
};
