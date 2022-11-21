import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { getFormValues } from "../../../utils/getFormValues";

interface Props {
  initialNovelties: any[];
}
const NoveltiesPage = ({ initialNovelties }: Props) => {
  const toast = useToast();
  const [novelties, setNovelties] = useState<any[]>(initialNovelties);
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = getFormValues(data);

    const novelty = {
      description: values.description,
      link: values.link,
      imageUrl: values.imageUrl,
    };

    const result = await fetch(`/api/v1/novelty`, {
      method: "POST",
      body: JSON.stringify(novelty),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        description: "Novelty created",
        status: "success",
        title: "Created",
        isClosable: true,
      });
      const response = await fetch(`/api/v1/novelty`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const jsonData = await response.json();
        setNovelties(jsonData.novelties);
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
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Description: </FormLabel>
          <Input name="description"></Input>
          <FormLabel>Link: </FormLabel>
          <Input name="link"></Input>
          <FormLabel>ImageUrl: </FormLabel>
          <Input name="imageUrl"></Input>
          <Button type="submit">Create</Button>
        </FormControl>
      </form>

      {novelties &&
        novelties.map((novelty: any) => (
          <Box key={novelty.id}>
            <a href={`novelties/${novelty.id}`}>{`${novelty.description}`}</a>
          </Box>
        ))}
    </>
  );
};

export const getServerSideProps = async () => {
  const novelties = await prisma.novelty.findMany();
  return {
    props: {
      initialNovelties: novelties.map((novelty) => ({
        ...novelty,
        date: novelty.date.toISOString(),
      })),
    },
  };
};

export default NoveltiesPage;
