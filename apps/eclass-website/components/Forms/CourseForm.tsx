import { ReactChild, useState } from "react";
import {
  FormLabel,
  Grid,
  GridItem,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import { GridContainer } from "../GridContainer";
import { GridItemInput } from "./common/GridItemInput";
import { ImageUploader } from "./common/ImageUploader";
import { Color } from "@prisma/client";

interface Props {
  course?: any;
  users: any[];
  buttonText?: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children?: ReactChild;
}

const CourseForm = ({
  users,
  handleSubmit,
  course = null,
  buttonText = "Añadir",
  children,
}: Props) => {
  const {
    name,
    description,
    slug,
    moreInfo,
    imageUrl,
    enrollmentId,
    settings,
  } = course || {};
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
                Curso
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
                label="Slug"
                defaultValue={slug || ""}
                name="slug"
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
              label="Más información"
              defaultValue={moreInfo || ""}
              name="moreInfo"
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              label="ID de inscripción"
              defaultValue={enrollmentId || ""}
              name="enrollmentId"
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              type="select"
              label="Dueño"
              name="owner"
              defaultValue={course?.owner?.id || ""}
              options={users.map((user: any) => ({
                value: user.id,
                label: `${user.lastName}, ${user.firstName}`,
              }))}
            />
            <GridItemInput
              colSpan={[12, 12, 6, 6]}
              type="select"
              label="Color"
              name="color"
              defaultValue={settings?.baseColor || Color.blue}
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
            <input type="hidden" name="imageUrl" value={newImageUrl} />
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

export default CourseForm;
