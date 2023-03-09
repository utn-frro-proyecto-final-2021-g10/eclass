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
  Badge,
  Image,
} from "@chakra-ui/react";
import {
  CloseIcon,
  HamburgerIcon,
  BellIcon,
  ArrowBackIcon,
  AtSignIcon,
} from "@chakra-ui/icons";
import { courseContext } from "../../layouts/course-layout";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const Tab = ({ displayName, url }: { displayName: string; url: string }) => {
  const router = useRouter();
  const currentPath = router.asPath.startsWith(url);

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
          <a>
            <Image src="/logo.png" alt="e-Class" w="6.5rem" />
          </a>
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
            {me?.role === "professor" && (
              <Tab
                displayName="Calificaciones"
                url={`/course/${course.slug}/qualifications`}
              />
            )}
          </Stack>
        </Box>
      )}
      <Box pb={{ base: 0, lg: 2 }}>
        <Stack spacing={6} align="center" direction="row">
          <Menu>
            <MenuButton
              as={BellIcon}
              cursor="pointer"
              aria-label="Settings"
              boxSize="6"
              variant="ghost"
            />
            <MenuList>
              <Text py={2} px={4}>
                No tienes notificaciones nuevas
              </Text>
            </MenuList>
          </Menu>
          {me?.role !== "student" && (
            <Badge
              colorScheme={me?.role === "admin" ? "pink" : "blue"}
              variant="solid"
            >
              {me?.role}
            </Badge>
          )}
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
              <Link href={"/profile"} passHref>
                <MenuItem lineHeight={1} icon={<AtSignIcon />}>
                  Mi Perfil
                </MenuItem>
              </Link>
              <Link href="/api/auth/signout" passHref>
                <MenuItem as="a" lineHeight={1} icon={<ArrowBackIcon />}>
                  Cerrar Sesión
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
          {course && (
            <Box onClick={toggle} display={{ lg: "none" }} cursor="pointer">
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
