import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  header: string;
  submit: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ModalForm = ({
  isOpen,
  onOpen,
  onClose,
  header,
  submit,
  children,
  onSubmit,
}: Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='teal' type='submit'>
                {submit}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <IconButton
        position='fixed'
        bottom={7}
        right={7}
        zIndex={1}
        bg='gray.700'
        color='white'
        sx={{
          '&:hover': {
            bg: 'gray.800',
          },
        }}
        aria-label='Enroll in a course'
        variant='outline'
        w={16}
        h={16}
        borderRadius='full'
        icon={<AddIcon />}
        onClick={onOpen}
      />
    </>
  );
};
