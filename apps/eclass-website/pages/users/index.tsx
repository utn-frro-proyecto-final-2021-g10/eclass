import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { json } from "stream/consumers";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getFormValues } from "../../utils/getFormValues";

interface UsersPageProps {
  users: User[];
}
const UsersPage = ({ users }: UsersPageProps) => {
  const me = useCurrentUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    let user = {
      email: values.email,
      firstName : values.firstName,
      lastName: values.lastName,
      password: values.password,
      profileImageUrl: values.profileImageUrl,
      role: values.role, 
      birthDate : new Date(values.birthDate),
    }

    
    const result = await fetch(
      `/api/v1/user`,
      {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(JSON.stringify(result));
  }

  useEffect(() => {
    console.log(me);

    if (me && me.role !== "admin") {
      router.replace("/api/auth/signin");
    }
  }, [me, router]);

  return (
    <>
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>First Name: </FormLabel>
        <Input name="firstName"></Input>
        <FormLabel>Last Name: </FormLabel>
        <Input name="lastName"></Input>
        <FormLabel>Birth Date: </FormLabel>
        <Input name="birthDate" type={"date"}></Input>
        <FormLabel>Email: </FormLabel>
        <Input name="email" type={"email"}></Input>
        <FormLabel>Image Url: </FormLabel>
        <Input name="profileImageUrl"></Input>
        <FormLabel>Password: </FormLabel>
        <Input name="password" type={"password"}></Input>
        <FormLabel>Role: </FormLabel>
        <Input name="role"></Input>
      </FormControl>
      <Button type="submit">Create</Button>

    </form>
      {me !== null &&
        users &&
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
      users,
    },
  };
};

export default UsersPage;
