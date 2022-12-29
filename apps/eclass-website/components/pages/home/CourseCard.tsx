import { useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Heading,
  Divider,
  AspectRatio,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { SettingsIcon, ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useFormToast } from "../../../hooks/useFormToast";
import { FullCourse } from "../../../types/Course";
import { Card, CardHeader, CardBody } from "../../Card";
import { useQueryClient } from "react-query";

export const CourseCard = ({ course }: { course: FullCourse }) => {
  const queryClient = useQueryClient();
  const { hasCopied: hasCopiedEnrollmentId, onCopy: onCopyEnrollmentId } =
    useClipboard(course.enrollmentId);
  const toast = useToast();
  const { showToast } = useFormToast({
    successMessage: "El desenrollamiento ha sido exitoso",
  });
  const me = useCurrentUser();

  useEffect(() => {
    if (hasCopiedEnrollmentId) {
      toast({
        title: `El código de enrollamiento para ${course.name} ha sido copiado`,
        description: course.enrollmentId,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [hasCopiedEnrollmentId, toast, course]);

  const handleCopyEnrollmentId = (e: React.MouseEvent) => {
    e.preventDefault();
    onCopyEnrollmentId();
  };

  const handleDisenroll = async (enrollmentId: string) => {
    const result = await fetch("/api/v1/course/disenroll", {
      method: "POST",
      body: JSON.stringify({ enrollmentId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    showToast(data);
    if (data.success) {
      queryClient.invalidateQueries("current-user");
    }
  };

  return (
    <Card
      baseColor={course.settings?.baseColor}
      href={`/course/${course.slug}/feed`}
    >
      <CardHeader>
        <HStack spacing="2">
          <Avatar src={course.imageUrl} />
          <VStack align="left" spacing="0">
            <Heading size="s">{course.name}</Heading>
            <Heading size="xs">{course.description}</Heading>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3}>
          <HStack spacing={3} pos="relative">
            <AspectRatio ratio={3} width="100%">
              <Box>
                <VStack
                  spacing={1}
                  paddingRight={28}
                  align="start"
                  height="100%"
                  overflowY="scroll"
                  width="100%"
                  marginRight="-30px"
                ></VStack>
              </Box>
            </AspectRatio>
            <Avatar
              size="xl"
              showBorder
              borderWidth="3px"
              position="absolute"
              right={0}
              top="-4rem"
              src={
                course.ownerId === me?.id
                  ? me?.profileImageUrl
                  : course.owner?.profileImageUrl
              }
            />
          </HStack>
          <Divider />
          <HStack spacing={3} justify="space-between">
            <Tooltip label="Copy enrollment id">
              <Badge
                as="button"
                onClick={handleCopyEnrollmentId}
                variant="outline"
                colorScheme={course.settings?.baseColor || "teal"}
              >
                {course.enrollmentId}
              </Badge>
            </Tooltip>
            <Menu placement="top-start">
              <MenuButton
                as={IconButton}
                size="sm"
                aria-label="Course options"
                icon={<SettingsIcon />}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <MenuList>
                <MenuItem
                  onClick={(e) => {
                    handleDisenroll(course.enrollmentId);
                    e.stopPropagation();
                  }}
                  icon={<ArrowBackIcon />}
                >
                  Salir del curso
                </MenuItem>
                {me?.role === "professor" && (
                  <MenuItem
                    onClick={(e) => {
                      alert("Edit course");
                      e.stopPropagation();
                    }}
                    icon={<EditIcon />}
                  >
                    Editar curso
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
