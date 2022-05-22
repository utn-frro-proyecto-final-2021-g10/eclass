import { Course, CourseSettings, User, Forum } from "@prisma/client";

export interface FullCourse extends Course {
  settings?: CourseSettings;
  forum?: Forum;
  owner?: User;
}
