import { Box, Button, useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import UserForm from "../../../components/Forms/UserForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";

interface UsersPageProps {
  initialUser: any;
}

const UserPage = ({ initialUser }: UsersPageProps) => {
  const router = useRouter();
  const me = useCurrentUser(Role.admin);
  const toast = useToast();
  const [user, setUser] = useState(initialUser);

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
    };

    const result = await fetch(`/api/v1/user/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status == 200) {
      toast({
        title: "Updated",
        description: "User updated",
        status: "success",
        isClosable: true,
      });
      const result = await fetch(`/api/v1/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();
      setUser(data.user);
    } else {
      toast({
        title: "Error",
        description: "Error updating user",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    const result = await fetch(`/api/v1/user/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      router.back();
    }
    return;
  };

  return (
    <>
      <Box>
        <UserForm
          handleSubmit={handleSubmit}
          buttonText={"Update"}
          user={user}
        />
        <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
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
    },
  });
  user.birthDate = user.birthDate.toISOString().substring(0, 10);
  return {
    props: { initialUser: user },
  };
};

export default UserPage;
