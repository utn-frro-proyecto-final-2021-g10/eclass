import { useEffect, useState } from "react";
import { Institution } from "@prisma/client";

export const useInstitution = () => {
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      const response = await fetch("/api/v1/institution", {
        method: "GET",
      });
      if (response.status === 200) {
        const data = await response.json();
        setInstitution(data.institution);
      }
    };

    fetchInstitution();
  }, []);
  console.log(institution);

  return institution;
};
