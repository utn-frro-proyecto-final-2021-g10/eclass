import { createContext, useState, useMemo } from "react";
import { Course } from "@prisma/client";
import { BaseLayout, BaseLayoutProps } from "./base-layout";
import { Header } from "../components/Header";
import { GridContainer } from "../components/GridContainer";

interface CourseContextProps {
  course: Course | null;
  setCourse: any;
}

export const courseContext = createContext<CourseContextProps>({
  course: null,
  setCourse: () => {},
});

export const CourseLayout = ({ children }: BaseLayoutProps) => {
  const [course, setCourse] = useState<Course | null>(null);

  const context: CourseContextProps = useMemo(
    () => ({
      course,
      setCourse,
    }),
    [course]
  );

  return (
    <courseContext.Provider value={context}>
      <BaseLayout>
        <Header
          title={course?.name}
          subtitle={course?.description}
          imageUrl={course?.imageUrl}
        />
        <GridContainer>{children}</GridContainer>
      </BaseLayout>
    </courseContext.Provider>
  );
};
