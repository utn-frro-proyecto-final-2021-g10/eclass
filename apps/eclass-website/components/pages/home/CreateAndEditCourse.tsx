import { useEffect, useState } from "react";
import { ModalForm } from "../../ModalForm";
import { Grid, FormLabel, GridItem } from "@chakra-ui/react";
import { GridItemInput } from "../../Forms/common/GridItemInput";
import { ImageUploader } from "../../Forms/common/ImageUploader";
import { Color } from "@prisma/client";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { FullCourse } from "../../../types/Course";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  courseToEdit?: FullCourse | null;
}

export const CreateAndEditCourse = ({
  isOpen,
  onClose,
  handleSubmit,
  courseToEdit,
}: Props) => {
  const me = useCurrentUser();
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (courseToEdit) {
      setNewImageUrl(courseToEdit.imageUrl);
    } else {
      setNewImageUrl("");
    }
  }, [courseToEdit]);

  return (
    <ModalForm
      size="xl"
      header={courseToEdit ? "Editar curso" : "Crear curso"}
      submit={courseToEdit ? "Editar" : "Crear"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {me && (
        <Grid gap={2} w="100%">
          <GridItemInput
            size="sm"
            label="Nombre"
            name="name"
            colSpan={6}
            defaultValue={courseToEdit?.name || ""}
          />
          <GridItemInput
            colSpan={6}
            size="sm"
            type="select"
            label="Color"
            name="color"
            defaultValue={courseToEdit?.settings?.baseColor || Color.blue}
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
            defaultValue={courseToEdit?.description || ""}
          />
          <GridItemInput
            size="sm"
            label="Slug"
            name="slug"
            colSpan={6}
            defaultValue={courseToEdit?.slug || ""}
          />
          <GridItemInput
            colSpan={6}
            size="sm"
            label="ID de inscripción"
            name="enrollmentId"
            defaultValue={courseToEdit?.enrollmentId || ""}
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
            defaultValue={courseToEdit?.moreInfo || ""}
          />

          <input type="hidden" name="imageUrl" value={newImageUrl} />
        </Grid>
      )}
    </ModalForm>
  );
};
