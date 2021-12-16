import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/v1/user/me", {
        method: "GET",
      });
      const data = await response.json();
      data.success && setMe(data.user);
    };

    fetchUser();
  }, [session]);

  return me;
};
