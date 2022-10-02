import type { NextPage } from "next";
import { Header } from "../components/Header";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useInstitution } from "../hooks/useInstitution";
import { AdminDashboard } from "../components/pages/home/AdminDashboard";
import { Dashboard } from "../components/pages/home/Dashboard";
import { Novelty } from "@prisma/client";


interface Props {
  novelties: Novelty[]
}

const Home: NextPage<Props> = ({ novelties }: Props) => {
  const institution = useInstitution();
  const me = useCurrentUser();

  return (
    <>
      {institution && <Header
        title={institution.name}
        subtitle={institution.description}
        imageUrl={institution.imageUrl}
      />}
      <pre>
        {JSON.stringify(novelties, null, 2)}
      </pre>
      {me?.role === "admin" && <AdminDashboard />}
      {me?.role === "student" && me.courses && <Dashboard initialCourses={me.courses?.map((enrollment) => enrollment.course)} />}
      {me?.role === "professor" && me.ownedCourses && <Dashboard initialCourses={me.ownedCourses} />}
    </>
  )
}

export const getServerSideProps = async () => {
  const novelties = await prisma.novelty.findMany({})
  return {
    props: {
      novelties
    }
  }
}


export default Home;
