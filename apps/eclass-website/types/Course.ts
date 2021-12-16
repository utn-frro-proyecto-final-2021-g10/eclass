import { Course, CourseSettings } from "@prisma/client";

export interface FullCourse extends Course {
  settings?: CourseSettings;
}
