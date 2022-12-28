import { ModalForm } from '../../ModalForm';
import { useDisclosure, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useFormToast } from '../../../hooks/useFormToast';
import { getFormValues } from '../../../utils/getFormValues';
import { useQueryClient } from 'react-query';

export const Enrollment = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useFormToast({
    successMessage: 'Se inscribió al curso correctamente',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);
    const result = await fetch('/api/v1/course/enroll', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await result.json();
    showToast(data);
    //@ts-ignore
    e.target.reset();
    if (data.success) {
      onClose();
      queryClient.invalidateQueries('current-user');
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      header={'Inscribirse a un curso'}
      submit='Inscribirse'>
      <FormControl>
        <FormLabel>Código de inscripción</FormLabel>
        <Input required name='enrollmentId' placeholder='FÍSICA-101' />
      </FormControl>
    </ModalForm>
  );
};
