import { useState } from "react";
import { BaseLayout, BaseLayoutProps } from "./base-layout";
import { Header } from "../components/Header";
import { useInstitution } from "../hooks/useInstitution";
import { IconButton } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Novelties } from "../components/pages/home/Novelties";

export const InstitutionLayout = ({ children }: BaseLayoutProps) => {
  const { institution, novelties } = useInstitution();
  const [isNoveltiesOpen, setIsNoveltiesOpen] = useState(false);

  return (
    <>
      <BaseLayout>
        <Header
          title={institution?.name}
          subtitle={institution?.description}
          imageUrl={institution?.imageUrl}
        >
          <IconButton
            aria-label="Abrir novedades"
            title="Abrir novedades"
            icon={<InfoOutlineIcon width="5" height="5" color="white" />}
            borderRadius="full"
            colorScheme="whiteAlpha"
            pos={"absolute"}
            right={0}
            variant="ghost"
            onClick={() => setIsNoveltiesOpen(true)}
          />
        </Header>
        {children}
      </BaseLayout>
      <Novelties
        novelties={novelties || undefined}
        onClose={() => setIsNoveltiesOpen(false)}
        isOpen={isNoveltiesOpen}
      />
    </>
  );
};
