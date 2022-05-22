async function getUserOwnedCourses(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      ownedCourses: true,
    },
  });
  return user?.ownedCourses;
}

export default getUserOwnedCourses;
