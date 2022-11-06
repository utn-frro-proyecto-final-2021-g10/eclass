import { Flex, Link } from "@chakra-ui/react";

export const AdminDashboard = () => {
  return (
    <Flex>
      <Link href="users">Users</Link>
      <Link href="courses">Courses</Link>
      <Link href="institution">Institution</Link>
      <Link href="novelties">Novelties</Link>
    </Flex>
  );
};
