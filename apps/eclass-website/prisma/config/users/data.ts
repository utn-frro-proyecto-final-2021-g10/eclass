import { User, Role } from "@prisma/client";

export const users: Omit<User, "id" | "institutionIdentifier">[] = [
  // ------------------------------------------------------------
  // Admin
  // ------------------------------------------------------------
  {
    firstName: "Super",
    lastName: "Admin",
    birthDate: new Date("1981-02-15"),
    email: "admin@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/admin.svg?b=%23dedede",
    password: "admin",
    role: Role.admin,
  },

  // ------------------------------------------------------------
  // Professors
  // ------------------------------------------------------------
  {
    firstName: "Sofía",
    lastName: "Gonzales",
    birthDate: new Date("1985-06-12"),
    email: "professor@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/sofia.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },
  {
    firstName: "Mariana",
    lastName: "Rodriguez",
    birthDate: new Date("1977-09-22"),
    email: "professor2@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/mariana.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },
  {
    firstName: "Juan",
    lastName: "López",
    birthDate: new Date("1978-11-05"),
    email: "professor3@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/juan.svg?b=%23dedede",
    password: "professor",
    role: Role.professor,
  },

  // ------------------------------------------------------------
  // Students
  // ------------------------------------------------------------
  {
    firstName: "Martina",
    lastName: "Pérez",
    birthDate: new Date("2002-07-20"),
    email: "student@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/martina-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Lucas",
    lastName: "González",
    birthDate: new Date("2003-05-12"),
    email: "student2@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/lucas-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Nicolás",
    lastName: "Fernández",
    birthDate: new Date("2000-11-29"),
    email: "student3@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/nicolas-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Valentina",
    lastName: "Gómez",
    birthDate: new Date("2001-04-05"),
    email: "student4@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/valentina-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Matías",
    lastName: "Martínez",
    birthDate: new Date("2002-02-12"),
    email: "student5@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/matias-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Camila",
    lastName: "Sánchez",
    birthDate: new Date("2003-01-23"),
    email: "student6@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/camila-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Agustín",
    lastName: "López",
    birthDate: new Date("2000-08-08"),
    email: "student7@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/agustin-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Martín",
    lastName: "Álvarez",
    birthDate: new Date("2001-06-14"),
    email: "student8@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/martin-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Juliana",
    lastName: "Romero",
    birthDate: new Date("2002-10-03"),
    email: "student9@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/juliana-1.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
  {
    firstName: "Sebastián",
    lastName: "Díaz",
    birthDate: new Date("2001-09-28"),
    email: "student10@eclass.com",
    profileImageUrl:
      "https://avatars.dicebear.com/api/bottts/sebastian-2.svg?b=%23dedede",
    password: "student",
    role: Role.student,
  },
];
