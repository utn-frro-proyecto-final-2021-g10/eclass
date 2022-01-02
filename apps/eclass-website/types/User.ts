import { User, Course, CourseMember } from "@prisma/client";

interface FullCourseMember extends CourseMember {
  course: Course
}

export interface FullUser extends User {
  courses?: FullCourseMember[];
}
