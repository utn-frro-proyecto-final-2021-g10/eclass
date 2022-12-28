import { Button, useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import NoveltyForm from "../../../components/Forms/NoveltyForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";

interface NoveltyPageProps {
  initialNovelties: any;
}

const NoveltyPage = ({ initialNovelties }: NoveltyPageProps) => {
  const toast = useToast();
  const router = useRouter();
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = eventToFormValues(e);

    const response = await fetch(`/api/v1/novelty/${initialNovelties.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = response.status === 200;

    toast({
      title: success ? "Actualizada" : "Error",
      status: success ? "success" : "error",
      description: success
        ? "La noticia ha sido actualizada con éxito"
        : "Error al actualizar la noticia",
      isClosable: true,
    });

    response.status === 200 && router.back();
  };

  const handleDelete = async (e: any) => {
    const res = await fetch(`/api/v1/novelty/${initialNovelties.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = res.status === 200;

    toast({
      title: success ? "Eliminada" : "Error",
      status: success ? "success" : "error",
      description: success
        ? "La noticia ha sido eliminada con éxito"
        : "Error al eliminar la noticia",
      isClosable: true,
    });

    res.status === 200 && router.back();
  };
  return (
    <NoveltyForm
      handleSubmit={handleSubmit}
      buttonText="Actualizar"
      headerText="Editar noticia"
      novelty={initialNovelties}
    >
      <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
        Eliminar
      </Button>
    </NoveltyForm>
  );
};

// @ts-ignore
NoveltyPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = async (context: any) => {
  const novelty: any = await prisma.novelty.findUnique({
    where: {
      id: context.params.id,
    },
  });

  return {
    props: {
      initialNovelties: {
        ...novelty,
        date: novelty.date.toISOString().substring(0, 10),
      },
    },
  };
};

export default NoveltyPage;
