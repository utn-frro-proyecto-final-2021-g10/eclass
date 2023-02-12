import { Color, CourseSettings } from "@prisma/client";
import { FullCourse } from "../../../types/Course";

interface ICourseSettings extends Omit<CourseSettings, "courseId" | "id"> {}

interface ICourse extends Omit<FullCourse, "id" | "settings"> {
  settings?: ICourseSettings;
}

export const courses: Omit<ICourse, "ownerId" | "forumId">[] = [
  {
    name: "Introducción a la Programación",
    slug: "intro-to-programming",
    description: "Comisión AB1",
    moreInfo:
      "In this course, we will learn the basics of programming and how to write code. We will also learn about the different types of programming languages, data structures and more.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/1.svg?b=%23dedede",
    enrollmentId: "INTRO-TO-PROGRAMMING-AB1",
    settings: {
      baseColor: Color.blue,
    },
  },
  {
    name: "Física I",
    slug: "physics-1",
    description: "Comisión AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/2.svg?b=%23dedede",
    enrollmentId: "PHYSICS-1-AB1",
    settings: {
      baseColor: Color.red,
    },
  },
  {
    name: "Cálculo I",
    slug: "calculus-1",
    description: "Comisión AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/3.svg?b=%23dedede",
    enrollmentId: "CALCULUS-1-AB1",
    settings: {
      baseColor: Color.green,
    },
  },
  {
    name: "Álgebra",
    slug: "algebra",
    description: "Comisión AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/4.svg?b=%23dedede",
    enrollmentId: "ALGEBRA-AB1",
    settings: {
      baseColor: Color.yellow,
    },
  },
  {
    name: "Arquitectura de las Computadoras",
    slug: "arquitecture-of-computers",
    description: "Comisión AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/5.svg?b=%23dedede",
    enrollmentId: "ARQUITECTURE-OF-COMPUTERS-AB1",
    settings: {
      baseColor: Color.pink,
    },
  },
  {
    name: "Sistemas y Organizaciones",
    slug: "systems-and-organizations",
    description: "Comisión AB1",
    moreInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://avatars.dicebear.com/api/identicon/6.svg?b=%23dedede",
    enrollmentId: "SYSTEMS-AND-ORGANIZATIONS-AB1",
    settings: {
      baseColor: Color.purple,
    },
  },
];
