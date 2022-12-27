import { useEffect, useState } from "react";
import { Institution, Novelty } from "@prisma/client";
import { useQuery } from "react-query";

const fetchInstitution = async () => {
  const response = await fetch("/api/v1/institution", {
    method: "GET",
  });
  if (response.status === 200) {
    const data = await response.json();
    return data.institution;
  }
};
const fetchNovelties = async () => {
  const response = await fetch("/api/v1/novelty", {
    method: "GET",
  });
  if (response.status === 200) {
    const data = await response.json();
    return data.novelties;
  }
};

export const useInstitutionQuery = () => {
  return useQuery(["institution"], () => fetchInstitution());
};

export const useNoveltiesQuery = () => {
  return useQuery(["novelties"], () => fetchNovelties());
};

export const useInstitution = () => {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [novelties, setNovelties] = useState<Novelty[] | null>(null);

  const institutionQuery = useInstitutionQuery();
  const noveltiesQuery = useNoveltiesQuery();

  useEffect(() => {
    setInstitution(institutionQuery.data);
    setNovelties(noveltiesQuery.data);
  }, [institutionQuery, noveltiesQuery]);

  return { institution, novelties };
};
