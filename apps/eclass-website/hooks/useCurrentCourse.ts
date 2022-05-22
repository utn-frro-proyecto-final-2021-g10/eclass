import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { courseContext } from "../layouts/course-layout";

const getCurrentCourse = async (courseId: string) => {
  const response = await fetch(`/api/v1/course/${courseId}`, {
    method: "GET",
  });
  const data = await response.json();
  const course = data.course;

  return course;
};

export const useCurrentCourseQuery = (courseId: string) => {
  return useQuery(["current-course", courseId], () =>
    getCurrentCourse(courseId)
  );
};

export const useCurrentCourse = (courseId: string) => {
  const { setCourse } = useContext(courseContext);
  const query = useCurrentCourseQuery(courseId);

  useEffect(() => {
    if (query.data) {
      setCourse(query.data);
    }
  }, [query, setCourse]);

  return query;
};
