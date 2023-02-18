import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";

interface Props {
  header: string;
  submit: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  onClose: () => void;
  isOpen: boolean;
}

export const ModalForm = ({
  header,
  submit,
  children,
  onSubmit,
  size,
  onClose,
  isOpen,
}: Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent mx={6}>
          <form onSubmit={onSubmit}>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="teal" type="submit">
                {submit}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
