import { Course, CourseSettings, User } from "@prisma/client";

export interface FullCourse extends Course {
  settings?: CourseSettings;
  owner?: User;
}
