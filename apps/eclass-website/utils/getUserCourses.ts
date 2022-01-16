
async function getUserCourses(id: string){
    const user = await prisma.user.findUnique({
        where:{
            id: id
        },
        include: {
            courses: true
        }
    });
    return user?.courses;
}


export default getUserCourses;