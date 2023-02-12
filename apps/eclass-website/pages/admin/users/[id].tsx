import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Role } from "@prisma/client";
import UserForm from "../../../components/Forms/UserForm";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

interface UsersPageProps {
  initialUser: any;
}

const UserPage = ({ initialUser }: UsersPageProps) => {
  const router = useRouter();
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = eventToFormValues(e);

    const updatedUser = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      profileImageUrl: values.profileImageUrl,
      role: values.role,
      birthDate: new Date(values.birthDate),
      institutionIdentifier: values.institutionIdentifier,
    };

    const response = await fetch(`/api/v1/user/${initialUser.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.status == 200 && router.back();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    const response = await fetch(`/api/v1/user/${initialUser.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.status == 200 && router.back();
  };

  return (
    <>
      <UserForm
        handleSubmit={handleSubmit}
        buttonText="Actualizar"
        headerText="Editar usuario"
        user={initialUser}
      >
        <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
          Eliminar
        </Button>
      </UserForm>
    </>
  );
};

// @ts-ignore
UserPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = async (context: any) => {
  let user: any = await prisma.user.findUnique({
    where: {
      id: context.params.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      email: true,
      profileImageUrl: true,
      birthDate: true,
      institutionIdentifier: true,
    },
  });
  user.birthDate = user.birthDate.toISOString().substring(0, 10);
  return {
    props: { initialUser: user },
  };
};

export default UserPage;
