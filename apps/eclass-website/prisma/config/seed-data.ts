import { Institution, User, Role, Color, CourseSettings } from "@prisma/client";
import { FullCourse } from "../../types/Course";

export const institution: Institution = {
  id: "institution",
  name: process.env.INSTITUTION_NAME!,
  description: process.env.INSTITUTION_DESCRIPTION!,
  imageUrl: process.env.INSTITUTION_IMAGE_URL!,
  address: process.env.INSTITUTION_ADDRESS!,
  city: process.env.INSTITUTION_CITY!,
  state: process.env.INSTITUTION_STATE!,
  phone: process.env.INSTITUTION_PHONE!,
  email: process.env.INSTITUTION_EMAIL!,
  website: process.env.INSTITUTION_WEBSITE!,
};

export const users: Omit<User, "id">[] = [
  // ------------------------------------------------------------
  // Admin
  // ------------------------------------------------------------
  {
    firstName: "Matthew",
    lastName: "Hunt",
    birthDate: new Date("2000-01-01"),
    email: "admin@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/admin-1.svg?b=%23dedede",
    password: "admin",
    role: Role.admin,
  },

  // ------------------------------------------------------------
  // Professors
  // ------------------------------------------------------------
  {
    firstName: "Sara",
    lastName: "Mason",
    birthDate: new Date("2000-01-01"),
    email: "professor@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/professor-1.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },
  {
    firstName: "Darryl",
    lastName: "Abrams",
    birthDate: new Date("2000-01-01"),
    email: "professor2@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/professor-2.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },
  {
    firstName: "Jayne",
    lastName: "Townsend",
    birthDate: new Date("2000-01-01"),
    email: "professor3@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/professor-3.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },

  // ------------------------------------------------------------
  // Students
  // ------------------------------------------------------------
  {
    firstName: "Catherine",
    lastName: "Harker",
    birthDate: new Date("2000-01-01"),
    email: "student@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "John",
    lastName: "Howitt",
    birthDate: new Date("2000-01-01"),
    email: "student2@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-2.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Elizabeth",
    lastName: "Kenyon",
    birthDate: new Date("2000-01-01"),
    email: "student3@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-3.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Timothy",
    lastName: "Boucher",
    birthDate: new Date("2000-01-01"),
    email: "student4@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-4.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Paula",
    lastName: "Montgomery",
    birthDate: new Date("2000-01-01"),
    email: "student5@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-5.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Donald",
    lastName: "Smith",
    birthDate: new Date("2000-01-01"),
    email: "student6@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/student-6.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
];

interface ICourseSettings extends Omit<CourseSettings, "courseId" | "id"> {}

interface ICourse extends Omit<FullCourse, "id" | "settings"> {
  settings?: ICourseSettings;
}

export const courses: Omit<ICourse, "ownerId">[] = [
  {
    name: "Introduction to Programming",
    slug: "intro-to-programming",
    description: "Commission AB1",
    moreInfo:
      "In this course, we will learn the basics of programming and how to write code. We will also learn about the different types of programming languages, data structures and more.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/1.svg?b=%23dedede",
    enrollmentId: "INTRO-TO-PROGRAMMING-AB1",
    settings: {
      baseColor: Color.blue,
    },
  },
  {
    name: "Physics I",
    slug: "physics-1",
    description: "Commission AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/2.svg?b=%23dedede",
    enrollmentId: "PHYSICS-1-AB1",
    settings: {
      baseColor: Color.red,
    },
  },
  {
    name: "Calculus I",
    slug: "calculus-1",
    description: "Commission AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/3.svg?b=%23dedede",
    enrollmentId: "CALCULUS-1-AB1",
    settings: {
      baseColor: Color.green,
    },
  },
  {
    name: "Algebra",
    slug: "algebra",
    description: "Commission AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/4.svg?b=%23dedede",
    enrollmentId: "ALGEBRA-AB1",
    settings: {
      baseColor: Color.yellow,
    },
  },
  {
    name: "Arquitecture of computers",
    slug: "arquitecture-of-computers",
    description: "Commission AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/5.svg?b=%23dedede",
    enrollmentId: "ARQUITECTURE-OF-COMPUTERS-AB1",
    settings: {
      baseColor: Color.pink,
    },
  },
  {
    name: "Systems and organizations",
    slug: "systems-and-organizations",
    description: "Commission AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/6.svg?b=%23dedede",
    enrollmentId: "SYSTEMS-AND-ORGANIZATIONS-AB1",
    settings: {
      baseColor: Color.purple,
    },
  },
];
