import React from "react";
import Link from "next/link";
import { Button, HStack, Divider } from "@chakra-ui/react";
import { AddIcon, AttachmentIcon } from "@chakra-ui/icons";
import { GridContainer } from "../../GridContainer";
import { GridItem } from "@chakra-ui/react";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { eventToFormValues } from "../../../utils/eventToFormValues";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useQueryClient } from "react-query";
import { CreateAndEditCourse } from "./CreateAndEditCourse";

export const ProfessorSettings = () => {
  const me = useCurrentUser();
  const toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();
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

            <Link href="/material" passHref>
              <Button
                as="a"
                outline="none"
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
      <CreateAndEditCourse
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
