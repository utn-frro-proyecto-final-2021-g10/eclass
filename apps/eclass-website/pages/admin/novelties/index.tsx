import { useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { getFormValues } from "../../../utils/getFormValues";
import { Novelties } from "../../../components/Listings/Novelties";
import NoveltyForm from "../../../components/Forms/NoveltyForm";
import { useQueryClient } from "react-query";
import { useInstitution } from "../../../hooks/useInstitution";

const NoveltiesPage = () => {
  const toast = useToast();
  const { novelties } = useInstitution();
  const queryClient = useQueryClient();
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

    const success = result.status === 200;

    toast({
      title: success ? "Creada" : "Error",
      status: success ? "success" : "error",
      description: success
        ? "La noticia ha sido creada con éxito "
        : "Error al crear la noticia",
      isClosable: true,
    });

    if (result.status === 200) {
      // @ts-ignore
      e.target.reset();
      queryClient.invalidateQueries("novelties");
    }
  };

  return (
    <>
      <NoveltyForm handleSubmit={handleSubmit} />
      <Novelties novelties={novelties || []} />
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
      novelties: novelties.map((novelty) => ({
        ...novelty,
        date: novelty.date.toISOString(),
      })),
    },
  };
};

export default NoveltiesPage;
