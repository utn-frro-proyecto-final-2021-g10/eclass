import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import router, { useRouter } from "next/router";
import { getFormValues } from "../../utils/getFormValues";

interface UsersPageProps {
  user: any;
}

const UserPage = ({ user }: UsersPageProps) => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);
    let updatedUser = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      profileImageUrl: values.profileImageUrl,
      role: values.role,
      birthDate: new Date(values.birthDate),
    };

    console.log("Entro");
    console.log(user.id);
    const result = await fetch(`/api/v1/user/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status == 200) {
      router.reload();
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
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>First Name: </FormLabel>
        <Input name="firstName" defaultValue={user.firstName}></Input>
        <FormLabel>Last Name: </FormLabel>
        <Input name="lastName" defaultValue={user.lastName}></Input>
        <FormLabel>Birth Date: </FormLabel>
        <Input
          name="birthDate"
          type={"date"}
          defaultValue={user.birthDate}
        ></Input>
        <FormLabel>Email: </FormLabel>
        <Input name="email" type={"email"} defaultValue={user.email}></Input>
        <FormLabel>Image Url: </FormLabel>
        <Input
          name="profileImageUrl"
          defaultValue={user.profileImageUrl}
        ></Input>
        <FormLabel>Password: </FormLabel>
        <Input name="password" type={"password"}></Input>
        <FormLabel>Role: </FormLabel>
        <RadioGroup name="role">
          <Radio value={"student"} checked={user.role === "student"}>
            Student
          </Radio>
          <Radio value={"professor"} checked={user.role === "professor"}>
            Professor
          </Radio>
          <Radio value={"admin"} checked={user.role === "admin"}>
            Admin
          </Radio>
        </RadioGroup>
      </FormControl>
      <Button type="submit">Update</Button>
      <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
        Delete
      </Button>
    </form>
  );
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
  let date = new Date();

  user.birthDate = date.toISOString().substring(0, 10);
  return {
    props: { user },
  };
};

export default UserPage;
