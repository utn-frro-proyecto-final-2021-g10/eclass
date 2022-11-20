import { useState } from "react";
import type { NextPage } from "next";
import { PrismaClient } from "@prisma/client";
import { Header } from "../components/Header";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useInstitution } from "../hooks/useInstitution";
import { AdminDashboard } from "../components/pages/home/AdminDashboard";
import { Dashboard } from "../components/pages/home/Dashboard";
import { Novelty } from "@prisma/client";
import { Novelties } from "../components/pages/home/Novelties";
import { IconButton } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

interface Props {
  novelties: Novelty[];
}

const Home: NextPage<Props> = ({ novelties }: Props) => {
  const institution = useInstitution();
  const me = useCurrentUser();
  const [isNoveltiesOpen, setIsNoveltiesOpen] = useState(false);

  return (
    <>
      {institution && (
        <Header
          title={institution.name}
          subtitle={institution.description}
          imageUrl={institution.imageUrl}
        >
          <IconButton
            aria-label="Abrir novedades"
            title="Abrir novedades"
            icon={<InfoOutlineIcon width="5" height="5" color="white" />}
            borderRadius="full"
            colorScheme="whiteAlpha"
            variant="ghost"
            onClick={() => setIsNoveltiesOpen(true)}
          />
        </Header>
      )}
      <Novelties
        novelties={novelties}
        onClose={() => setIsNoveltiesOpen(false)}
        isOpen={isNoveltiesOpen}
      />
      {me?.role === "admin" && <AdminDashboard />}
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

export const getServerSideProps = async () => {
  const prisma = new PrismaClient();
  const novelties = await prisma.novelty.findMany({});
  return {
    props: {
      novelties: novelties.map((novelty) => ({
        ...novelty,
        date: novelty.date.toISOString(),
      })),
    },
  };
};

export default Home;
