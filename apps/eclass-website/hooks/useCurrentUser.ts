import { useEffect, useState, useContext } from "react";
import { FullUser } from "../types/User";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

// TODO: use context to avoid multiple calls to /api/v1/user/me
const getCurrentUser = async () => {
  const response = await await fetch("/api/v1/user/me", {
    method: "GET",
  });
  const data = await response.json();
  const user = data.user;

  return user;
};

export const useCurrentUserQuery = () => {
  return useQuery(["current-user"], () => getCurrentUser());
};

export const useCurrentUser = () => {
  const router = useRouter();
  const session = useSession();
  const [me, setMe] = useState<FullUser | null>(null);
  const query = useCurrentUserQuery();

  useEffect(() => {
    if (session.status === "authenticated") {
      setMe(query.data);
    } else if (session.status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [session, router, query]);

  return me;
};
