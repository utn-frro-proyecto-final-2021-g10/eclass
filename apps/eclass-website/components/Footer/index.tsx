import { Box, Text, Stack, Link } from "@chakra-ui/react";
import { useInstitution } from "../../hooks/useInstitution";

export const Footer = () => {
  const { institution } = useInstitution();
  const { address, city, description, email, name, phone, state, website } =
    institution || {};

  return (
    <Box as="footer" role="contentinfo" w="100%" mt="auto">
      <Box bg="gray.100" color="gray.500" mt="8" textAlign="center"    sx={{
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}>
        <Stack
          maxW="1300"
          px="5"
          py="3"
          w="100%"
          mx="auto"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
        >
          <Stack
            direction="column"
            spacing={0}
            align={{ base: "center", md: "start" }}
          >
            <Link href={website} isExternal>
              <Text fontSize="xs" fontWeight={600}>
                {name}, {description}
              </Text>
            </Link>
            <Text fontSize="xs">
              © {new Date().getFullYear()} PencilPaperScissor
            </Text>
          </Stack>
          <Stack
            direction="column"
            spacing={0}
            align={{ base: "center", md: "end" }}
          >
            <Text fontSize="xs">
              {address}, {city}, {state}
            </Text>
            <Stack direction="row" spacing="2">
              <Link href={`tel:${phone}`} isExternal>
                <Text fontSize="xs">{phone}</Text>
              </Link>
              <Link href={`mailto:${email}`} isExternal>
                <Text fontSize="xs">{email}</Text>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
