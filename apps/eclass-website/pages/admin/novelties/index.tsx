import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  Text,
  useToast,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Link,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { GridContainer } from "../../../components/GridContainer";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { getFormValues } from "../../../utils/getFormValues";
import { GridItemInput } from "../../../components/Forms/common/GridItemInput";
import { ImageUploader } from "../../../components/Forms/common/ImageUploader";

interface Props {
  initialNovelties: any[];
}
const NoveltiesPage = ({ initialNovelties }: Props) => {
  const toast = useToast();
  const [novelties, setNovelties] = useState<any[]>(initialNovelties);
  useCurrentUser(Role.admin);

  const [imageUrl, setImageUrl] = useState(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const values = getFormValues(data);

    const novelty = {
      title: values.title,
      description: values.description,
      link: values.link,
      imageUrl: imageUrl,
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
      setImageUrl(undefined);
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
      <GridContainer>
        <GridItem colSpan={[0, 1, 1, 1]} />
        <GridItem colSpan={[12, 10, 10, 10]}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid gap={5} w="100%">
              <GridItem colSpan={12}>
                <Text fontSize="2xl" fontWeight="bold">
                  Añadir noticia
                </Text>
              </GridItem>
              <GridItem colSpan={[12, 12, 6, 6]}>
                <GridItemInput
                  colSpan={[12, 12, 4, 4]}
                  label="Título"
                  name="title"
                  mb={5}
                />
                <GridItemInput
                  colSpan={[12, 12, 4, 4]}
                  label="Descripción"
                  name="description"
                  mb={5}
                />
                <GridItemInput
                  colSpan={[12, 12, 4, 4]}
                  label="Link"
                  name="link"
                />
              </GridItem>
              <GridItem colSpan={[12, 12, 6, 6]}>
                <FormLabel>Imagen</FormLabel>
                <ImageUploader setImageUrl={setImageUrl} imageUrl={imageUrl} />
              </GridItem>
              <GridItem colSpan={12}>
                <HStack justify="end">
                  <Button type="submit" colorScheme="teal">
                    Añadir
                  </Button>
                </HStack>
              </GridItem>
            </Grid>
          </form>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem colSpan={[0, 1, 1, 1]} />
        <GridItem colSpan={[12, 10, 10, 10]}>
          <Grid gap={5} w="100%">
            <GridItem colSpan={12}>
              <Text fontSize="2xl" fontWeight="bold">
                Editar noticias
              </Text>
            </GridItem>
            <GridItem colSpan={12}>
              <TableContainer>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Título</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {novelties &&
                      novelties.map((novelty: any, i: number) => (
                        <Tr key={i}>
                          <Td>{novelty.title}</Td>
                          <Td>
                            <Link
                              colorScheme="teal"
                              href={`/admin/novelties/${novelty.id}`}
                            >
                              <Button
                                colorScheme="teal"
                                size="sm"
                                variant="outline"
                              >
                                Editar
                              </Button>
                            </Link>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </GridItem>
          </Grid>
        </GridItem>
      </GridContainer>
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
