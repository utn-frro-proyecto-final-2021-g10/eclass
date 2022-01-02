import { useEffect, useState } from "react";
import { FullUser } from "../types/User";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

// TODO: use context to avoid multiple calls to /api/v1/user/me
export const useCurrentUser = () => {
  const router = useRouter();
  const session = useSession();
  const [me, setMe] = useState<FullUser | null>(null);

  useEffect(() => {
    if (session.status === "authenticated") {
      const fetchUser = async () => {
        const response = await fetch("/api/v1/user/me", {
          method: "GET",
        });
        const data = await response.json();
        data.success && setMe(data.user);
      };

      fetchUser();
    } else if (session.status === "unauthenticated") {
      // TODO: find a way to do this in a better way
      router.replace("/api/auth/signin");
    }
  }, [session, router]);

  return me;
};
