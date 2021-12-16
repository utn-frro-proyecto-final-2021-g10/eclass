import { useEffect, useState } from "react";
import { Institution } from "@prisma/client";

export const useInstitution = () => {
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      const response = await fetch("/api/v1/institution", {
        method: "GET",
      });
      const data = await response.json();
      data.success && setInstitution(data.institution);
    };

    fetchInstitution();
  }, []);

  return institution;
};
