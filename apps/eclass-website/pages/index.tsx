import type { NextPage } from "next";
import { GridItem } from "@chakra-ui/layout";
import { Header } from "../components/Header";
import { GridContainer } from "../components/GridContainer";
import { CourseCard } from "../components/pages/home/CourseCard";
import { Enrollment } from "../components/pages/home/Enrollment";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useInstitution } from "../hooks/useInstitution";
import { Loader } from "../components/Loader";

const Home: NextPage = () => {
  const institution = useInstitution();
  const me = useCurrentUser();

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
      <Enrollment />
      <GridContainer>
        {me?.courses &&
          me.courses.map((enrollment, i) => (
            <GridItem key={i} colSpan={[12, 12, 6, 4]}>
              <CourseCard course={enrollment.course} />
            </GridItem>
          ))}
      </GridContainer>
    </>
  );
};

export default Home;
