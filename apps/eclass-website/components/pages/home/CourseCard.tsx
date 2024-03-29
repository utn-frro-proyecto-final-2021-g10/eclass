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
import {
  SettingsIcon,
  ArrowBackIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useFormToast } from "../../../hooks/useFormToast";
import { FullCourse } from "../../../types/Course";
import { Card, CardHeader, CardBody } from "../../Card";
import { useQueryClient } from "react-query";

export const CourseCard = ({
  course,
  isOwner,
  onEditCourse,
}: {
  course: FullCourse;
  isOwner?: boolean;
  onEditCourse?: (course: FullCourse) => void;
}) => {
  const queryClient = useQueryClient();
  const { hasCopied: hasCopiedEnrollmentId, onCopy: onCopyEnrollmentId } =
    useClipboard(course.enrollmentId);
  const toast = useToast();
  const { showToast: disenrollToast } = useFormToast({
    successMessage: "Te has desinscrito del curso con éxito",
  });
  const { showToast: removeToast } = useFormToast({
    successMessage: "El curso ha sido eliminado con éxito",
  });

  const me = useCurrentUser();

  useEffect(() => {
    if (hasCopiedEnrollmentId) {
      toast({
        title: `El código de inscripción para ${course.name} ha sido copiado`,
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
    disenrollToast(data);
    if (data.success) {
      queryClient.invalidateQueries("current-user");
    }
  };

  const handleRemove = async (id: string) => {
    const result = await fetch(`/api/v1/course/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    removeToast(data);
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
            <Tooltip label="Copiar ID de inscripción">
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
                {isOwner ? (
                  <MenuItem
                    onClick={(e) => {
                      handleRemove(course.id);
                      e.stopPropagation();
                    }}
                    icon={<DeleteIcon />}
                  >
                    Eliminar curso
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={(e) => {
                      handleDisenroll(course.enrollmentId);
                      e.stopPropagation();
                    }}
                    icon={<ArrowBackIcon />}
                  >
                    Salir del curso
                  </MenuItem>
                )}
                {me?.role === "professor" && onEditCourse && (
                  <MenuItem
                    onClick={(e) => {
                      onEditCourse(course);
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
