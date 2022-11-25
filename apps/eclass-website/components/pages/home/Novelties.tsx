import {
  GridItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  Grid,
} from "@chakra-ui/react";
import { Novelty } from "@prisma/client";

import { NoveltyCard } from "./NoveltyCard";

interface Props {
  novelties?: Novelty[];
  onClose: () => void;
  isOpen: boolean;
}

export const Novelties = ({ novelties, onClose, isOpen }: Props) => {
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Novedades</DrawerHeader>
          <DrawerBody>
            <Grid gap={5} templateColumns="repeat(12, 1fr)" w="100%">
              {novelties &&
                novelties.map((novelty, i) => (
                  <GridItem key={i} colSpan={[12, 12, 12, 12]}>
                    <NoveltyCard novelty={novelty} />
                  </GridItem>
                ))}
            </Grid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
