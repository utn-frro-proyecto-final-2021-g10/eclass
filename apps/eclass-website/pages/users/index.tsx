import { Box } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { json } from "stream/consumers";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface UsersPageProps {
  users: User[];
}
const UsersPage = ({ users }: UsersPageProps) => {
  const me = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    console.log(me);

    if (me && me.role !== "admin") {
      router.replace("/api/auth/signin");
    }
  }, [me, router]);

  return (
    <>
      {me !== null &&
        users &&
        users.map((user: User) => (
          <Box key={user.id}>
            <a
              href={`users/${user.id}`}
            >{`${user.lastName}, ${user.firstName}`}</a>
          </Box>
        ))}
    </>
  );
};

interface UserDTO {
  firstName: string;
  lastName: string;
  id: true;
}
export const getServerSideProps = async (context: any) => {
  const users = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  });
  return {
    props: {
      users,
    },
  };
};

export default UsersPage;
