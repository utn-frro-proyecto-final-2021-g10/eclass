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
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
interface Props {
  header: string;
  submit: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const ModalForm = ({
  header,
  submit,
  children,
  onSubmit,
  size,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
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
        aria-label={header}
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
