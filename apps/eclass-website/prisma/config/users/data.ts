import { User, Role } from "@prisma/client";

export const users: Omit<User, "id" | "institutionIdentifier">[] = [
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
