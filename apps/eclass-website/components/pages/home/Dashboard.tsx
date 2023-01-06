import { GridItem, Heading } from "@chakra-ui/react";
import { Course } from "@prisma/client";
import { GridContainer } from "../../GridContainer";
import { CourseCard } from "./CourseCard";
interface Props {
  initialCourses: Course[];
  heading?: string;
  ownedCourses?: boolean;
}

export const Dashboard = ({ initialCourses, heading, ownedCourses }: Props) => {
  return (
    <>
      {initialCourses?.length > 0 && (
        <GridContainer mb={8}>
          <GridItem colSpan={12}>
            <Heading as="h2" size="md">
              {heading}
            </Heading>
          </GridItem>
          {initialCourses &&
            initialCourses.map((course, i) => (
              <GridItem key={i} colSpan={[12, 12, 6, 4]}>
                <CourseCard course={course} isOwner={ownedCourses} />
              </GridItem>
            ))}
        </GridContainer>
      )}
    </>
  );
};
