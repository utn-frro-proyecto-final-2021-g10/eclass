import { useState } from "react";
import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useBoolean,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { AddIcon } from "@chakra-ui/icons";
import { useQueryClient } from "react-query";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";

interface AssignFileProps {
  file: any;
}

export const AssignFile = ({ file }: AssignFileProps) => {
  const [modalOpen, setModalOpen] = useBoolean();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    file.assignedTo.map((a: any) => a.courseId)
  );
  const me = useCurrentUser();

  const handleAsign = async () => {
    const result = await fetch(`/api/v1/file/${file.id}/assign`, {
      method: "POST",
      body: JSON.stringify({
        courses: selectedCourses,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Asignado" : "Error",
      description: success
        ? "El archivo se asignó correctamente"
        : "Error al asignar el archivo",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-user");
    }

    setModalOpen.off();
  };

  return (
    <>
      <Modal isOpen={modalOpen} onClose={setModalOpen.off}>
        <ModalOverlay />
        <ModalContent>
          <form autoComplete="off">
            <ModalHeader>Asignar {`"${file.title}"`} a un curso</ModalHeader>
            <ModalBody>
              {me && (
                <Select
                  name="course"
                  isMulti
                  placeholder="Selecciona un curso"
                  options={me?.courses?.map((course) => ({
                    value: course.course.id,
                    label: course.course.name,
                  }))}
                  defaultValue={selectedCourses.map((id) => {
                    const course = me.courses?.find((c) => c.course.id === id);

                    return (
                      course && {
                        value: course?.course.id,
                        label: course?.course.name,
                      }
                    );
                  })}
                  onChange={(value: any) => {
                    setSelectedCourses(value.map((v: any) => v.value));
                  }}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={setModalOpen.off}>
                Cancelar
              </Button>
              <Button colorScheme="teal" onClick={handleAsign}>
                Asignar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Button
        colorScheme="green"
        size="sm"
        leftIcon={<AddIcon />}
        onClick={setModalOpen.on}
      >
        Asignar
      </Button>
    </>
  );
};
