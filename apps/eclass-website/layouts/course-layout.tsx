import { createContext } from "react";
import { Course } from "@prisma/client";
import { BaseLayout, BaseLayoutProps } from "./base-layout";
import { Header } from "../components/Header";
import { GridContainer } from "../components/GridContainer";

interface CourseLayoutProps extends BaseLayoutProps {
  course: Course;
}

export const courseContext = createContext<Course | null>(null);

export const CourseLayout = ({ children, course }: CourseLayoutProps) => {
  return (
    <courseContext.Provider value={course}>
      <BaseLayout>
        <Header title={course.name} subtitle={course.description} />
        <GridContainer>{children}</GridContainer>
      </BaseLayout>
    </courseContext.Provider>
  );
};
