import {
  Box,
  useToast,
} from "@chakra-ui/react";
import { Role, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserForm from "../../components/Forms/UserForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { eventToFormValues } from "../../utils/eventToFormValues";

interface UsersPageProps {
  initialUsers: User[];
}
const UsersPage = ({ initialUsers }: UsersPageProps) => {
  const me = useCurrentUser(Role.admin);
  const router = useRouter();
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
        title: "Created",
        description: "User created succesfully",
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
      }
    } else {
      toast({
        title: "Error",
        description: "Error creating user",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (me && me.role !== "admin") {
      router.replace("/api/auth/signin");
    }
  }, [me, router]);

  return (
    <>
      <UserForm handleSubmit={handleSubmit} buttonText={"Create"} />
      {users &&
        users.map((user: User) => (
          <Box key={user.id}>
            <a
              href={`users/${user.id}`}
            >{`${user.lastName}, ${user.firstName}`}</a>
          </Box>
        ))}
    </>
  );
};

interface UserDTO {
  firstName: string;
  lastName: string;
  id: true;
}
export const getServerSideProps = async (context: any) => {
  const users = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  });
  return {
    props: {
      initialUsers: users,
    },
  };
};

export default UsersPage;
