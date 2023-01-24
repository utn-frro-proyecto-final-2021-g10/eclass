import { useState } from "react";
import type { NextPage } from "next";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Dashboard } from "../components/pages/home/Dashboard";
import { InstitutionLayout } from "../layouts/institution-layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Enrollment } from "../components/pages/home/Enrollment";
import { ProfessorSettings } from "../components/pages/home/ProfessorSettings";
import { CreateAndEditCourse } from "../components/pages/home/CreateAndEditCourse";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { FullCourse } from "../types/Course";
import { eventToFormValues } from "../utils/eventToFormValues";
import { useQueryClient } from "react-query";

const Home: NextPage = () => {
  const me = useCurrentUser();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [courseToEdit, setCourseToEdit] = useState<FullCourse | null>(null);

  useEffect(() => {
    if (me) {
      if (me.role === "admin") {
        router.push("/admin");
      }
    }
  }, [me, router]);

  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const course = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      moreInfo: values.moreInfo,
      imageUrl: values.imageUrl,
      enrollmentId: values.enrollmentId,
      settings: {
        baseColor: values.color,
      },
    };

    const result = await fetch(`/api/v1/course/${courseToEdit?.id}`, {
      method: "PUT",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Exito" : "Error",
      description: success
        ? "El curso ha sido editado con exito"
        : "Error al editar el curso",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-user");
      onClose();
    }
  };

  const onEditCourse = (course: FullCourse) => {
    setCourseToEdit(course);
    onOpen();
  };

  return (
    <>
      <Enrollment />

      {me?.role == "professor" && (
        <>
          <ProfessorSettings />
          <CreateAndEditCourse
            isOpen={isOpen}
            onClose={onClose}
            courseToEdit={courseToEdit}
            handleSubmit={handleEditCourse}
          />
        </>
      )}

      {me?.role === "professor" && me.ownedCourses && (
        <Dashboard
          initialCourses={me.ownedCourses}
          heading="Mis cursos"
          ownedCourses
          onEditCourse={onEditCourse}
        />
      )}

      {me?.role === "professor" && me.courses && (
        <Dashboard
          initialCourses={me.courses
            ?.filter(
              (enrollment) =>
                me.ownedCourses?.find(
                  (course) => course.id === enrollment.course.id
                ) === undefined
            )
            .map((enrollment) => enrollment.course)}
          heading="Cursos en los que estoy inscrito"
          onEditCourse={onEditCourse}
        />
      )}

      {me?.role === "student" && me.courses && (
        <Dashboard
          initialCourses={me.courses?.map((enrollment) => enrollment.course)}
        />
      )}
    </>
  );
};

// @ts-ignore
Home.getLayout = function getLayout(page: NextPage) {
  return <InstitutionLayout>{page}</InstitutionLayout>;
};

export default Home;
