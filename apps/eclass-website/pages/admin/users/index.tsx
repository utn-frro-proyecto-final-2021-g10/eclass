import { useToast } from "@chakra-ui/react";
import { Role, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserForm from "../../../components/Forms/UserForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { Users } from "../../../components/Listings/Users";

interface UsersPageProps {
  initialUsers: User[];
}
const UsersPage = ({ initialUsers }: UsersPageProps) => {
  useCurrentUser(Role.admin);
  const toast = useToast();
  const [users, setUsers] = useState(initialUsers);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const user = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      profileImageUrl: values.profileImageUrl,
      role: values.role,
      institutionIdentifier: values.institutionIdentifier,
      birthDate: new Date(values.birthDate),
    };

    const result = await fetch(`/api/v1/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Creado",
        description: "El usuario ha sido creado con éxito",
        status: "success",
        isClosable: true,
      });

      const result = await fetch(`/api/v1/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        const data = await result.json();
        setUsers(data.users);
        // @ts-ignore
        e.target.reset();
      }
    } else {
      toast({
        title: "Error",
        description: "Error al crear el usuario",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <UserForm handleSubmit={handleSubmit} />
      <Users users={users} />
    </>
  );
};

// @ts-ignore
UsersPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = async (context: any) => {
  const users = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      id: true,
      role: true,
    },
    orderBy: [
      {
        role: "asc",
      },
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],
  });
  return {
    props: {
      initialUsers: users,
    },
  };
};

export default UsersPage;
