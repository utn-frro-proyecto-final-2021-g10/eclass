
async function userIsInCourse(userId: string, courseId: string){
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        },
        include: {
            courses: true
        }
    });

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });
    if (course){
        return user?.courses.map(course => course.courseId).includes(course?.id);
    }
    return false;
}


export default userIsInCourse;