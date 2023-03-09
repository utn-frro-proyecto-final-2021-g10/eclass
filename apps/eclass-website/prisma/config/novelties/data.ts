import { Novelty } from "@prisma/client";

export const novelties: Omit<Novelty, "id" | "date">[] = [
  {
    title: "lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl ultricies nunc, vitae aliquam nisl nisl sit amet nunc. Sed euismod, nisl nec ultricies lacinia, nunc nisl ultricies nunc, vitae aliquam nisl nisl sit amet nunc.",
    imageUrl: "https://picsum.photos/200/300",
    link: "https://www.google.com",
  },
  {
    title: "lorem ipsum Dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl ultricies nunc, vitae aliquam nisl nisl sit amet nunc. Sed euismod, nisl nec ultricies lacinia.",
    imageUrl: "https://picsum.photos/200/301",
    link: "https://www.google.com",
  },
  {
    title: "lorem ipsum Dolor sit",
    description: "Lorem ipsum dolor sit amet.",
    imageUrl: "https://picsum.photos/200/302",
    link: "https://www.google.com",
  },
  {
    title: "lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.",
    imageUrl: "https://picsum.photos/200/303",
    link: "https://www.google.com",
  },
  {
    title: "lorem ipsum Dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageUrl: "https://picsum.photos/200/304",
    link: "https://www.google.com",
  },
];
