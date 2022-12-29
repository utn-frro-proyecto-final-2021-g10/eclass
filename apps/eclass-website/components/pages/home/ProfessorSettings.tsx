import { useState } from "react";
import { ModalForm } from "../../ModalForm";
import {
  Button,
  HStack,
  Divider,
  Grid,
  FormLabel,
  Link,
} from "@chakra-ui/react";
import { AddIcon, AttachmentIcon } from "@chakra-ui/icons";
import { GridContainer } from "../../GridContainer";
import { GridItem } from "@chakra-ui/react";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { GridItemInput } from "../../Forms/common/GridItemInput";
import { ImageUploader } from "../../Forms/common/ImageUploader";
import { Color } from "@prisma/client";
import { useQueryClient } from "react-query";

export const ProfessorSettings = () => {
  const me = useCurrentUser();
  const toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [newImageUrl, setNewImageUrl] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const course = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      moreInfo: values.moreInfo,
      imageUrl: values.imageUrl,
      enrollmentId: values.enrollmentId,
      owner: {
        connect: {
          id: me?.id,
        },
      },
      settings: {
        create: {
          baseColor: values.color,
        },
      },
    };

    const result = await fetch(`/api/v1/course`, {
      method: "POST",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Exito" : "Error",
      description: success
        ? "El curso ha sido creado correctamente"
        : "Error al crear el curso",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      const response = await result.json();
      await fetch("/api/v1/course/enroll", {
        method: "POST",
        body: JSON.stringify({
          enrollmentId: response.course.enrollmentId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      queryClient.invalidateQueries("current-user");
      onClose();
    }
  };

  return (
    <>
      <GridContainer mb={4}>
        <GridItem colSpan={12}>
          <HStack spacing={4}>
            <Button
              onClick={onOpen}
              leftIcon={<AddIcon />}
              colorScheme="green"
              size="sm"
            >
              Crear un curso
            </Button>

            <Link href="/material">
              <Button
                leftIcon={<AttachmentIcon />}
                colorScheme="blue"
                variant="outline"
                size="sm"
              >
                Administrar mi material
              </Button>
            </Link>
          </HStack>
        </GridItem>
        <GridItem colSpan={12}>
          <Divider />
        </GridItem>
      </GridContainer>
      <ModalForm
        size="xl"
        header="Crear un curso"
        submit="Crear"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        {me && (
          <Grid gap={2} w="100%">
            <GridItemInput size="sm" label="Nombre" name="name" colSpan={6} />
            <GridItemInput
              colSpan={6}
              size="sm"
              type="select"
              label="Color"
              name="color"
              defaultValue={Color.blue}
              options={[
                { value: Color.blue, label: Color.blue },
                { value: Color.green, label: Color.green },
                { value: Color.orange, label: Color.orange },
                { value: Color.pink, label: Color.pink },
                { value: Color.purple, label: Color.purple },
                { value: Color.red, label: Color.red },
                { value: Color.yellow, label: Color.yellow },
              ]}
            />
            <GridItemInput
              size="sm"
              label="Descripción"
              name="description"
              colSpan={12}
            />
            <GridItemInput size="sm" label="Slug" name="slug" colSpan={6} />
            <GridItemInput
              colSpan={6}
              size="sm"
              label="ID de inscripción"
              name="enrollmentId"
            />
            <GridItem colSpan={12}>
              <FormLabel fontSize="sm">Imagen</FormLabel>
              <ImageUploader
                setImageUrl={setNewImageUrl}
                imageUrl={newImageUrl}
              />
            </GridItem>
            <GridItemInput
              size="sm"
              label="Más información"
              name="moreInfo"
              colSpan={12}
            />

            <input type="hidden" name="imageUrl" value={newImageUrl} />
          </Grid>
        )}
      </ModalForm>
    </>
  );
};
