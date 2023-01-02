import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  HStack,
  GridItem,
  Grid,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useBoolean,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { eventToFormValues } from "../utils/eventToFormValues";
import { GridContainer } from "../components/GridContainer";
import { AvatarHeader } from "../components/Header";
import { EditIcon } from "@chakra-ui/icons";
import { useQueryClient } from "react-query";

const ProfilePage: NextPage = () => {
  const [modalOpen, setModalOpen] = useBoolean();
  const me = useCurrentUser();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [loading, setLoading] = useBoolean();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const user = {
      id: me?.id,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: new Date(values.birthDate),
    };

    const result = await fetch(`/api/v1/user/updateMyInfo`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Actualizada",
        description: "La información se actualizó correctamente",
        status: "success",
        isClosable: true,
      });

      queryClient.invalidateQueries("current-user");
    } else {
      toast({
        title: "Error",
        description: "Error actualizando la información",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleEditProfileImage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading.on();

    const values = eventToFormValues(e);

    const formData = new FormData();
    formData.append("id", me?.id || "");
    formData.append("image", values.image);

    const result = await fetch(`/api/v1/user/updateProfileImage`, {
      method: "PUT",
      body: formData,
    });

    setModalOpen.off();

    if (result.status === 200) {
      toast({
        title: "Actualizada",
        description: "La imagen se actualizó correctamente",
        status: "success",
        isClosable: true,
      });

      queryClient.invalidateQueries("current-user");
    } else {
      toast({
        title: "Error",
        description: "Error actualizando la imagen de perfil",
        status: "error",
        isClosable: true,
      });
    }
    setLoading.off();
  };

  if (!me) {
    return null;
  }

  return (
    <>
      <Modal isOpen={modalOpen} onClose={setModalOpen.off}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleEditProfileImage} autoComplete="off">
            <ModalHeader>Actualizar imagen de perfil</ModalHeader>
            <ModalBody>
              <input required name="image" type="file" />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={setModalOpen.off}>
                Cancelar
              </Button>
              <Button colorScheme="teal" type="submit" isLoading={loading}>
                Actualizar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AvatarHeader
        imageUrl={me?.profileImageUrl}
        name={`${me?.firstName} ${me?.lastName}`}
      >
        <IconButton
          aria-label="Edit"
          icon={<EditIcon />}
          pos="absolute"
          right="0"
          bottom="0"
          transform={{ translateX: "50%", translateY: "50%" }}
          colorScheme="teal"
          borderRadius="full"
          onClick={setModalOpen.on}
        />
      </AvatarHeader>
      <GridContainer>
        <GridItem colSpan={[0, 1, 2, 3]} />
        <GridItem colSpan={[12, 10, 8, 6]}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid gap={5} templateColumns="repeat(6, 1fr)" w="100%">
              <GridItem colSpan={6}>
                <Text fontSize="2xl" fontWeight="bold">
                  Información Básica
                </Text>
              </GridItem>
              <GridItem colSpan={[6, 6, 3, 3]}>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input name="firstName" defaultValue={me?.firstName} />
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 3, 3]}>
                <FormControl isRequired>
                  <FormLabel>Apellido</FormLabel>
                  <Input name="lastName" defaultValue={me?.lastName} />
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 2, 2]}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input defaultValue={me?.email} name="email" type="email" />
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 2, 2]}>
                <FormControl isRequired>
                  <FormLabel>Fecha de Nac</FormLabel>
                  <Input
                    name="birthDate"
                    defaultValue={
                      new Date(me?.birthDate).toISOString().split("T")[0]
                    }
                    type="date"
                  ></Input>
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 2, 2]}>
                <FormControl isRequired>
                  <FormLabel>Legajo</FormLabel>
                  <Input defaultValue={me?.institutionIdentifier} disabled />
                </FormControl>
              </GridItem>
              <GridItem colSpan={6}>
                <HStack justify="end">
                  <Button type="submit" colorScheme="teal">
                    Guardar
                  </Button>
                </HStack>
              </GridItem>
            </Grid>
          </form>
          <form autoComplete="off">
            <Grid gap={5} templateColumns="repeat(6, 1fr)" w="100%" mt="6">
              <GridItem colSpan={6}>
                <Text fontSize="2xl" fontWeight="bold">
                  Cambiar Contraseña
                </Text>
                <Text fontSize="sm" color="gray.500">
                  (No implementado)
                </Text>
              </GridItem>
              <GridItem colSpan={6}>
                <FormControl isRequired>
                  <FormLabel>Contraseña Actual</FormLabel>
                  <Input type="password" />
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 3, 3]}>
                <FormControl isRequired>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <Input type="password" />
                </FormControl>
              </GridItem>
              <GridItem colSpan={[6, 6, 3, 3]}>
                <FormControl isRequired>
                  <FormLabel>Repetir Nueva Contraseña</FormLabel>
                  <Input type="password" />
                </FormControl>
              </GridItem>
              <GridItem colSpan={6}>
                <HStack justify="end">
                  <Button type="submit" colorScheme="teal" variant="outline">
                    Cambiar
                  </Button>
                </HStack>
              </GridItem>
            </Grid>
          </form>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default ProfilePage;
