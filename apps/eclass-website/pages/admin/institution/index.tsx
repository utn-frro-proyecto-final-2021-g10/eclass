import { useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import InstitutionForm from "../../../components/Forms/InstitutionForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { AdminLayout } from "../../../layouts/admin-layout";
import { useQueryClient } from "react-query";

interface Props {
  institution: any;
}

const InstitutionPage = ({ institution }: Props) => {
  useCurrentUser(Role.admin);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = eventToFormValues(e);

    const result = await fetch(`/api/v1/institution/`, {
      method: "PUT",
      body: JSON.stringify({ id: "institution", ...values }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Actualizado" : "Error",
      status: success ? "success" : "error",
      description: success
        ? "La institución ha sido actualizada con éxito"
        : "Ha ocurrido un error al actualizar la institución",
      isClosable: true,
    });

    success && queryClient.invalidateQueries("institution");
  };

  return (
    <InstitutionForm handleSubmit={handleSubmit} institution={institution} />
  );
};

// @ts-ignore
InstitutionPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = async () => {
  const institution = await prisma.institution.findFirst();
  return {
    props: {
      institution,
    },
  };
};

export default InstitutionPage;
