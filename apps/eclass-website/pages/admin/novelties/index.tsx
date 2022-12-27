import { useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { getFormValues } from "../../../utils/getFormValues";
import { Novelties } from "../../../components/Listings/Novelties";
import NoveltyForm from "../../../components/Forms/NoveltyForm";

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
      title: values.title,
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

      e.target.reset();
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
      <NoveltyForm handleSubmit={handleSubmit} />
      <Novelties novelties={novelties} />
    </>
  );
};

// @ts-ignore
NoveltiesPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
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
