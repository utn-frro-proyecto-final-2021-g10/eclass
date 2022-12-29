import { useToast } from "@chakra-ui/react";

export const useFormToast = ({ successMessage }: { successMessage: any }) => {
  const toast = useToast();
  const duration = 5000;

  const showToast = (formData: any) => {
    toast({
      title: formData.success ? "Éxito" : "Error",
      description: formData.success ? successMessage : formData.message,
      status: formData.success ? "success" : "error",
      duration,
      isClosable: true,
    });
  };

  return { showToast };
};
