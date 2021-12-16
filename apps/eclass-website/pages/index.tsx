import type { NextPage } from "next";
import { GridItem } from "@chakra-ui/layout";
import { Header } from "../components/Header";
import { GridContainer } from "../components/GridContainer";
import { CourseCard } from "../components/pages/home/CourseCard";
import { useInstitution } from "../hooks/useInstitution";
import { Loader } from "../components/Loader";

const Home: NextPage = () => {
  const institution = useInstitution();

  if (!institution) {
    return <Loader />;
  }

  return (
    <>
      <Header
        title={institution.name}
        subtitle={institution.description}
        imageUrl={institution.imageUrl}
      />
      <GridContainer>
        {[...Array(9)].map((_, i) => (
          <GridItem key={i} colSpan={[12, 12, 6, 4]}>
            <CourseCard />
          </GridItem>
        ))}
      </GridContainer>
    </>
  );
};

export default Home;
