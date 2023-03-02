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
  name?: string;
  extraAction?: React.ReactNode;
}

export const ModalForm = ({
  header,
  submit,
  children,
  onSubmit,
  size,
  onClose,
  isOpen,
  name,
  extraAction,
}: Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent mx={6}>
          <form onSubmit={onSubmit} name={name}>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              {extraAction}
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
