import {
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getFormValues } from "../../utils/getFormValues";

interface CoursePageProps {
  course: any;
}

const CoursePage = ({ course }: CoursePageProps) => {
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

    const result = await fetch(`/api/v1/user/${course.id}`, {
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

    const result = await fetch(`/api/v1/user/${course.id}`, {
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
        <FormLabel>Name: </FormLabel>
        <Input name="name"></Input>
        <FormLabel>Description: </FormLabel>
        <Input name="description"></Input>
        <FormLabel>Slug: </FormLabel>
        <Input name="slug"></Input>
        <FormLabel>More Info: </FormLabel>
        <Input name="moreInfo"></Input>
        <FormLabel>Image Url: </FormLabel>
        <Input name="imageUrl"></Input>
        <FormLabel>Enrollment ID: </FormLabel>
        <Input name="enrollmentId"></Input>
        <FormLabel>Owner: </FormLabel>
        <Input name="owner"></Input>
        <FormLabel>Color: </FormLabel>
        <Input name="baseColor"></Input>
      </FormControl>
      <Button type="submit">Update</Button>
      <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
        Delete
      </Button>
    </form>
  );
};

export const getServerSideProps = async (context: any) => {
  let course: any = await prisma.course.findUnique({
    where: {
      id: context.params.id,
    },
  });

  return {
    props: { course },
  };
};

export default CoursePage;
