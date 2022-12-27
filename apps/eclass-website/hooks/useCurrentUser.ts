import { useEffect, useState } from "react";
import { FullUser } from "../types/User";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

// TODO: use context to avoid multiple calls to /api/v1/user/me
const getCurrentUser = async () => {
  const response = await fetch("/api/v1/user/me", {
    method: "GET",
  });
  const data = await response.json();
  const user = data.user;

  return user;
};

export const useCurrentUserQuery = () => {
  return useQuery(["current-user"], () => getCurrentUser());
};

export const useCurrentUser = (role?: string) => {
  const router = useRouter();
  const session = useSession();
  const [me, setMe] = useState<FullUser | null>(null);
  const query = useCurrentUserQuery();

  useEffect(() => {
    if (session.status === "authenticated") {
      setMe(query.data);

      if (role && me && me.role.toString() !== role) {
        router.replace("/api/auth/signin");
      }
    } else if (session.status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [session, router, query, role, me]);

  return me;
};
