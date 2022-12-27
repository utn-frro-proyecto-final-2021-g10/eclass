import { useState } from "react";
import { FormLabel, Button, Grid } from "@chakra-ui/react";
import { GridContainer } from "../GridContainer";
import { GridItem, Text, HStack } from "@chakra-ui/react";
import { GridItemInput } from "./common/GridItemInput";
import { ImageUploader } from "./common/ImageUploader";
import { Role } from "@prisma/client";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  user?: any | null;
  buttonText?: string;
  children?: ReactChild;
}

const UserForm = ({
  handleSubmit,
  user = null,
  buttonText = "Añadir",
  children,
}: Props) => {
  const {
    firstName,
    lastName,
    birthDate,
    email,
    profileImageUrl,
    institutionIdentifier,
    password,
    role,
  } = user || {};

  const [newImageUrl, setNewImageUrl] = useState(profileImageUrl);

  return (
    <GridContainer>
      <GridItem colSpan={[0, 1, 1, 1]} />
      <GridItem colSpan={[12, 10, 10, 10]}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid gap={5} w="100%">
            <GridItem colSpan={12}>
              <Text fontSize="2xl" fontWeight="bold">
                Usuarios
              </Text>
            </GridItem>
            <GridItem colSpan={[12, 12, 6, 6]}>
              <GridItemInput
                label="Nombre"
                defaultValue={firstName || ""}
                name="firstName"
                mb={5}
              />
              <GridItemInput
                label="Apellido"
                defaultValue={lastName || ""}
                name="lastName"
                mb={5}
              />
              <GridItemInput
                label="Email"
                name="email"
                defaultValue={email || ""}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6, 6]}>
              <FormLabel>Imagen</FormLabel>
              <ImageUploader
                setImageUrl={setNewImageUrl}
                imageUrl={newImageUrl}
              />
            </GridItem>
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Fecha de nacimiento"
              name="birthDate"
              defaultValue={birthDate || ""}
              type="date"
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Legajo"
              name="institutionIdentifier"
              defaultValue={institutionIdentifier || ""}
              options={Object.values(Role)}
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Rol"
              name="role"
              defaultValue={role || ""}
              type="select"
              options={Object.values(Role)}
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Contraseña"
              name="password"
              type="password"
              defaultValue={password || ""}
            />
            <input type="hidden" name="profileImageUrl" value={newImageUrl} />
            <GridItem colSpan={12}>
              <HStack justify="end">
                {children}
                <Button type="submit" colorScheme="teal">
                  {buttonText}
                </Button>
              </HStack>
            </GridItem>
          </Grid>
        </form>
      </GridItem>
    </GridContainer>
  );
};

export default UserForm;
