async function userOwnsCourse(
  userId: string,
  courseId: string
): Promise<boolean | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      ownedCourses: true,
    },
  });

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
  if (course) {
    return user?.ownedCourses.map((course) => course.id).includes(course?.id);
  }
  return false;
}

export default userOwnsCourse;
