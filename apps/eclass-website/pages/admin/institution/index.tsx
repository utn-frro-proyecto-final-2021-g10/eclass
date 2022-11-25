import { useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import InstitutionForm from "../../../components/Forms/InstitutionForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { AdminLayout } from "../../../layouts/admin-layout";

interface Props {
  initialInstitution: any;
}

const InstitutionPage = ({ initialInstitution }: Props) => {
  const toast = useToast();
  const [institution, setInstitution] = useState(initialInstitution);
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);
    const updatedInstitution = {
      id: "institution",
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl || initialInstitution.imageUrl,
      address: values.address,
      city: values.city,
      state: values.state,
      phone: values.phone,
      email: values.email,
      website: values.website,
    };

    const result = await fetch(`/api/v1/institution/`, {
      method: "PUT",
      body: JSON.stringify(updatedInstitution),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Update",
        status: "success",
        description: "Institution updated succesfully",
        isClosable: true,
      });
      const response = await fetch(`/api/v1/institution/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setInstitution(data.institution);
      }
    } else {
      toast({
        title: "Error",
        status: "error",
        description: "Error updating institution",
        isClosable: true,
      });
    }
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
      initialInstitution: institution,
    },
  };
};

export default InstitutionPage;
