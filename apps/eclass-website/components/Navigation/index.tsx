import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Text,
  Stack,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  CloseIcon,
  HamburgerIcon,
  InfoIcon,
  ArrowBackIcon,
  AtSignIcon,
} from "@chakra-ui/icons";
import { courseContext } from "../../layouts/course-layout";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const Tab = ({ displayName, url }: { displayName: string; url: string }) => {
  const router = useRouter();
  const currentPath = router.asPath === url;

  return (
    <Link href={url} passHref>
      <Button
        as="a"
        w="fit-content"
        variant="ghost"
        size="lg"
        px={4}
        borderBottomRadius={{ base: 6, lg: 0 }}
        borderRight={{ base: currentPath ? "2px" : "none", lg: "none" }}
        borderLeft={{ base: currentPath ? "2px" : "none", lg: "none" }}
        borderTop={{ base: currentPath ? "2px" : "none", lg: "none" }}
        borderBottom={currentPath ? "2px" : "none"}
        borderBottomColor="gray.700"
      >
        <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">
          {displayName}
        </Text>
      </Button>
    </Link>
  );
};

export const Navigation = () => {
  const { course } = useContext(courseContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const me = useCurrentUser();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      px={6}
      pt={2}
      pb={{ base: 2, lg: 0 }}
      bg="gray.200"
      color="gray.700"
      boxShadow="lg"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Box color="gray.700" pb={[0, 0, 0, 2]}>
        <Link href="/" passHref>
          <Text
            as="a"
            fontSize="3xl"
            fontWeight="bold"
            cursor="pointer"
            lineHeight={1}
          >
            e-class
          </Text>
        </Link>
      </Box>
      {course && (
        <Box
          display={{ base: isOpen ? "block" : "none", lg: "block" }}
          flexBasis={{ base: "100%", lg: "auto" }}
          order={{ base: 2, lg: "unset" }}
          alignSelf="flex-end"
        >
          <Stack
            spacing={2}
            direction={{ base: "column", lg: "row" }}
            pt={{ base: 4, lg: 0 }}
          >
            <Tab
              displayName="Publicaciones"
              url={`/course/${course.slug}/feed`}
            />
            <Tab
              displayName="Material"
              url={`/course/${course.slug}/material`}
            />
            <Tab displayName="Tareas" url={`/course/${course.slug}/tasks`} />
            <Tab
              displayName="Participantes"
              url={`/course/${course.slug}/members`}
            />
          </Stack>
        </Box>
      )}
      <Box pb={{ base: 0, lg: 2 }}>
        <Stack spacing={6} align="center" direction="row">
          <Menu>
            <MenuButton
              as={InfoIcon}
              cursor="pointer"
              aria-label="Settings"
              boxSize="6"
              variant="ghost"
            />
            <MenuList></MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Avatar}
              cursor="pointer"
              aria-label="Settings"
              name={me ? `${me.firstName} ${me.lastName}` : undefined}
              src={me?.profileImageUrl}
              bgColor="transparent"
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<AtSignIcon />}>Profile</MenuItem>
              <Link href="/api/auth/signout" passHref>
                <MenuItem as="a" icon={<ArrowBackIcon />}>
                  Sign out
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
          {course && (
            <Box onClick={toggle} display={{ lg: "none" }}>
              {isOpen ? (
                <CloseIcon boxSize="4" />
              ) : (
                <HamburgerIcon boxSize="6" />
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};
