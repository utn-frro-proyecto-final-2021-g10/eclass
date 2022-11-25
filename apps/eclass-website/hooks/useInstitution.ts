import { useEffect, useState } from "react";
import { Institution, Novelty } from "@prisma/client";

export const useInstitution = () => {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [novelties, setNovelties] = useState<Novelty[] | null>(null);

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

    const fetchNovelties = async () => {
      const response = await fetch("/api/v1/novelty", {
        method: "GET",
      });
      if (response.status === 200) {
        const data = await response.json();
        setNovelties(data.novelties);
      }
    };

    fetchInstitution();
    fetchNovelties();
  }, []);

  return { institution, novelties };
};
