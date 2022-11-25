import type { NextPage } from "next";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Dashboard } from "../components/pages/home/Dashboard";
import { InstitutionLayout } from "../layouts/institution-layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
      {me?.role === "student" && me.courses && (
        <Dashboard
          initialCourses={me.courses?.map((enrollment) => enrollment.course)}
        />
      )}
      {me?.role === "professor" && me.ownedCourses && (
        <Dashboard initialCourses={me.ownedCourses} />
      )}
    </>
  );
};

// @ts-ignore
Home.getLayout = function getLayout(page: NextPage) {
  return <InstitutionLayout>{page}</InstitutionLayout>;
};

export default Home;
