import { User, Course, CourseMember, Folder } from "@prisma/client";

interface FullCourseMember extends CourseMember {
  course: Course;
}

export interface FullUser extends User {
  courses?: FullCourseMember[];
  ownedCourses?: Course[];
  folders?: Folder[];
}
