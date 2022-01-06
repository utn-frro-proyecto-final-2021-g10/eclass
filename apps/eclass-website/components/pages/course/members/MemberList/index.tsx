import {
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Checkbox,
  Fade,
  Box,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";

export const MemberList = ({
  heading,
  pluralHeading,
  users,
  selectState,
  onEnableSelect,
  checkedEmails,
  setCheckedEmails,
}) => {
  const me = useCurrentUser();

  const allChecked = Object.values(checkedEmails).every((value) => value);
  const isIndeterminate =
    Object.values(checkedEmails).some(Boolean) && !allChecked;

  return (
    <Card>
      <CardHeader
        onClick={() => {
          if (Object.keys(checkedEmails).length > 0) {
            onEnableSelect();
            setCheckedEmails(
              Object.fromEntries(
                Object.keys(checkedEmails).map((email) => [email, !allChecked])
              )
            );
          }
        }}
      >
        <HStack spacing="2" justify="space-between">
          <HStack spacing="2">
            {selectState && (
              <Checkbox
                colorScheme="teal"
                isChecked={
                  Object.keys(checkedEmails).length !== 0 && allChecked
                }
                isIndeterminate={isIndeterminate}
                isDisabled={Object.keys(checkedEmails).length === 0}
              />
            )}
            <Text fontSize="xl">{pluralHeading}</Text>
          </HStack>
          <Badge colorScheme="teal">
            {users.length} {users.length === 1 ? heading : pluralHeading}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody px={0} py={0}>
        <VStack align="left" spacing={0} divider={<Divider />}>
          {users.map((user, i: number) => (
            <HStack
              key={i}
              py={3}
              px={4}
              justify="space-between"
              as="button"
              _hover={{
                backgroundColor: "gray.50",
              }}
              sx={{
                transition: "background-color 0.2s ease-in-out",
              }}
              onClick={() => {
                if (user.id !== me?.id) {
                  onEnableSelect();
                  setCheckedEmails({
                    ...checkedEmails,
                    [user.email]: !checkedEmails[user.email],
                  });
                }
              }}
            >
              <HStack spacing="4">
                {selectState &&
                  (user.id === me?.id ? (
                    <Checkbox colorScheme="teal" isChecked={false} isDisabled />
                  ) : (
                    <Checkbox
                      colorScheme="teal"
                      isChecked={checkedEmails[user.email]}
                    />
                  ))}
                <Avatar src={user.profileImageUrl} size="sm" />
                <HStack spacing="2">
                  <Text fontSize="md">
                    {user.lastName}, {user.firstName}
                  </Text>
                  {user.id === me?.id && (
                    <Badge colorScheme="teal" variant="outline">
                      Yo
                    </Badge>
                  )}
                </HStack>
              </HStack>
              {user.id !== me?.id && (
                <IconButton
                  as="a"
                  icon={<EmailIcon />}
                  aria-label="Enviar Mensaje"
                  href={`mailto:${user.email}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              )}
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
