import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { User, Color } from "@prisma/client";
import { useRouter } from "next/router";
import { getFormValues } from "../../utils/getFormValues";

interface CoursePageProps {
  course: any;
  users: User[];
}

const CoursePage = ({ course, users }: CoursePageProps) => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    let updatedCourse = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      moreInfo: values.moreInfo,
      imageUrl: values.imageUrl,
      enrollmentId: values.enrollmentId,
      ownerId: values.owner,
      settings: {
        update: {
          baseColor: values.color
        }
      }
    };

    const result = await fetch(`/api/v1/course/${course.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCourse),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(result);

    if (result.status == 200) {
      router.reload();
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    const result = await fetch(`/api/v1/course/${course.id}`, {
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
        <Input name="name" defaultValue={course.name}></Input>
        <FormLabel>Description: </FormLabel>
        <Input name="description" defaultValue={course.description}></Input>
        <FormLabel>Slug: </FormLabel>
        <Input name="slug" defaultValue={course.slug}></Input>
        <FormLabel>More Info: </FormLabel>
        <Input name="moreInfo" defaultValue={course.moreInfo}></Input>
        <FormLabel>Image Url: </FormLabel>
        <Input name="imageUrl" defaultValue={course.imageUrl}></Input>
        <FormLabel>Enrollment ID: </FormLabel>
        <Input name="enrollmentId" defaultValue={course.enrollmentId}></Input>
        <FormLabel>Owner: </FormLabel>
        <RadioGroup name="owner" defaultValue={course.owner.id} display={"flex"} flexDir={"column"}>
          {users.map((user: any) => (
            <Radio
              key={user.id}
              value={user.id}
            >{`${user.id} - ${user.lastName}, ${user.firstName}`}</Radio>
          ))}
        </RadioGroup>
        <FormLabel>Color: </FormLabel>
        <RadioGroup name="color" defaultValue={course.settings.baseColor} display={"flex"} flexDir={"column"}>
          <Radio value={Color.blue}>{Color.blue}</Radio>
          <Radio value={Color.green}>{Color.green}</Radio>
          <Radio value={Color.orange}>{Color.orange}</Radio>
          <Radio value={Color.pink}>{Color.pink}</Radio>
          <Radio value={Color.purple}>{Color.purple}</Radio>
          <Radio value={Color.red}>{Color.red}</Radio>
          <Radio value={Color.yellow}>{Color.yellow}</Radio>
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
  const course: any = await prisma.course.findUnique({
    where: {
      id: context.params.id,
    },
    include: {
      settings: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
        },
      },
    },
  });
  const users = await prisma.user.findMany({
    where: {
      role: "professor",
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  });

  return {
    props: { course, users },
  };
};

export default CoursePage;
