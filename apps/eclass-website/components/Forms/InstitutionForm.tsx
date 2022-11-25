import { useState } from "react";
import { FormLabel, Button, Grid, Image } from "@chakra-ui/react";
import { Institution } from "@prisma/client";
import { GridContainer } from "../GridContainer";
import { GridItem, Text, HStack } from "@chakra-ui/react";
import { GridItemInput } from "./common/GridItemInput";
import { ImageUploader } from "./common/ImageUploader";
interface Props {
  institution: Institution;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
const InstitutionForm = ({ institution, handleSubmit }: Props) => {
  const {
    name,
    description,
    imageUrl,
    address,
    city,
    state,
    phone,
    email,
    website,
  } = institution;
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);

  return (
    <GridContainer>
      <GridItem colSpan={[0, 1, 1, 1]} />
      <GridItem colSpan={[12, 10, 10, 10]}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid gap={5} w="100%">
            <GridItem colSpan={12}>
              <Text fontSize="2xl" fontWeight="bold">
                Institución
              </Text>
            </GridItem>
            <GridItem colSpan={[12, 12, 6, 6]}>
              <GridItemInput
                label="Nombre"
                defaultValue={name || ""}
                name="name"
                mb={5}
              />
              <GridItemInput
                label="Descripción"
                defaultValue={description || ""}
                name="description"
                mb={5}
              />
              <GridItemInput
                label="Sitio Web"
                defaultValue={website || ""}
                name="website"
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
              colSpan={[12, 12, 4, 4]}
              label="Dirección"
              name="address"
              defaultValue={address || ""}
            />
            <GridItemInput
              colSpan={[12, 12, 4, 4]}
              label="Ciudad"
              name="city"
              defaultValue={city || ""}
            />
            <GridItemInput
              colSpan={[12, 12, 4, 4]}
              label="Provincia"
              name="state"
              defaultValue={state || ""}
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Teléfono"
              name="phone"
              defaultValue={phone || ""}
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="Email"
              name="email"
              defaultValue={email || ""}
            />
            <input type="hidden" name="imageUrl" value={newImageUrl} />
            <GridItem colSpan={12}>
              <HStack justify="end">
                <Button type="submit" colorScheme="teal">
                  Guardar
                </Button>
              </HStack>
            </GridItem>
          </Grid>
        </form>
      </GridItem>
    </GridContainer>
  );
};

export default InstitutionForm;
