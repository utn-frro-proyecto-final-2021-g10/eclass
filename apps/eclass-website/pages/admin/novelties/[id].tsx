import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { eventToFormValues } from "../../../utils/eventToFormValues";

interface NoveltyPageProps {
  initialNovelties: any;
}

const NoveltyPage = ({ initialNovelties }: NoveltyPageProps) => {
  const toast = useToast();
  const router = useRouter();
  const [novelty, setNovelty] = useState<any | null>(initialNovelties);
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const updatedNovelty = {
      description: values.description,
      link: values.link,
      imageUrl: values.imageUrl,
    };

    const result = await fetch(`/api/v1/novelty/${novelty.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedNovelty),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        description: "Novelty updated",
        status: "success",
        title: "Updated",
        isClosable: true,
      });
      const response = await fetch(`/api/v1/novelty/${novelty.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const jsonData = await response.json();
        setNovelty(jsonData.novelty);
      }
    } else {
      toast({
        description: "Error creating novelty",
        status: "error",
        title: "Error",
        isClosable: true,
      });
    }
  };

  const handleDelete = async (e: any) => {
    const res = await fetch(`/api/v1/novelty/${novelty.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      toast({
        title: "Deleted",
        description: "Novelty deleted succesfully",
        status: "success",
        isClosable: true,
      });
      router.back();
    } else {
      toast({
        title: "Error",
        description: "Error deleting novelty",
        status: "error",
        isClosable: true,
      });
    }
  };
  return (
    <>
      {novelty && (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Description: </FormLabel>
            <Input
              name="description"
              defaultValue={novelty.description}
            ></Input>
            <FormLabel>Link: </FormLabel>
            <Input name="link" defaultValue={novelty.link}></Input>
            <FormLabel>ImageUrl: </FormLabel>
            <Input name="imageUrl" defaultValue={novelty.imageUrl}></Input>
            <Button type="submit">Update</Button>
          </FormControl>
          <Button onClick={handleDelete} bg={"red.200"}>
            Delete
          </Button>
        </form>
      )}
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const novelty: any = await prisma.novelty.findUnique({
    where: {
      id: context.params.id,
    },
  });
  return {
    props: { initialNovelties: novelty },
  };
};

export default NoveltyPage;
