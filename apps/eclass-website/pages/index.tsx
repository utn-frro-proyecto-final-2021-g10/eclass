import type { NextPage } from "next";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Dashboard } from "../components/pages/home/Dashboard";
import { InstitutionLayout } from "../layouts/institution-layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Enrollment } from "../components/pages/home/Enrollment";
import { ProfessorSettings } from "../components/pages/home/ProfessorSettings";

const Home: NextPage = () => {
  const me = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (me) {
      if (me.role === "admin") {
        router.push("/admin");
      }
    }
  }, [me, router]);

  return (
    <>
      <Enrollment />

      {me?.role == "professor" && <ProfessorSettings />}

      {me?.role === "professor" && me.ownedCourses && (
        <Dashboard initialCourses={me.ownedCourses} heading="Mis cursos" ownedCourses />
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
