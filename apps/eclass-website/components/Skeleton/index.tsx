import { Skeleton as ChakraSkeleton } from "@chakra-ui/react";

interface SkeletonProps {
  children?: React.ReactNode;
}

export const Skeleton = ({ children }: SkeletonProps) => {
  return <ChakraSkeleton borderRadius="2xl">{children}</ChakraSkeleton>;
};
