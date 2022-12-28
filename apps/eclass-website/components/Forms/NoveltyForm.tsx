import { ReactChild, useState } from "react";
import { FormLabel, Button, Grid } from "@chakra-ui/react";
import { GridContainer } from "../GridContainer";
import { GridItem, Text, HStack } from "@chakra-ui/react";
import { GridItemInput } from "./common/GridItemInput";
import { ImageUploader } from "./common/ImageUploader";
import { Color } from "@prisma/client";

interface Props {
  novelty?: any;
  buttonText?: string;
  headerText?: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children?: ReactChild;
}

const NoveltyForm = ({
  handleSubmit,
  novelty = null,
  buttonText = "Añadir",
  headerText = "Añadir noticia",
  children,
}: Props) => {
  const { title, description, link, imageUrl } = novelty || {};

  const [newImageUrl, setNewImageUrl] = useState(imageUrl);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setNewImageUrl("");
    handleSubmit(e);
  };

  return (
    <GridContainer>
      <GridItem colSpan={[0, 1, 1, 1]} />
      <GridItem colSpan={[12, 10, 10, 10]}>
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <Grid gap={5} w="100%">
            <GridItem colSpan={12}>
              <Text fontSize="2xl" fontWeight="bold">
                {headerText}
              </Text>
            </GridItem>
            <GridItem colSpan={[12, 12, 6, 6]}>
              <GridItemInput
                colSpan={[12, 12, 4, 4]}
                label="Título"
                name="title"
                defaultValue={title || ""}
                mb={5}
              />
              <GridItemInput
                colSpan={[12, 12, 4, 4]}
                label="Descripción"
                name="description"
                defaultValue={description || ""}
                mb={5}
              />
              <GridItemInput
                colSpan={[12, 12, 4, 4]}
                label="Link"
                name="link"
                defaultValue={link || ""}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6, 6]}>
              <FormLabel>Imagen</FormLabel>
              <ImageUploader
                setImageUrl={setNewImageUrl}
                imageUrl={newImageUrl}
              />
            </GridItem>
            <input type="hidden" name="imageUrl" value={newImageUrl} />
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

export default NoveltyForm;
