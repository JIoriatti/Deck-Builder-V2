import prisma from ".";

export async function getUsers(){
    try{
        const users = await prisma.user.findMany();
        return { users }
    }catch(err){
        return { err }
    }
}

export async function createUser(user){
    try{
        const userData = await prisma.user.create({data: user})
        return { user: userData }
    }catch(err){
        return { err }
    }
}

export async function getUserById(userId){
    try{
        const user = await prisma.user.findUnique({where: { id: userId}})
        return { user }
    }catch(err){
        return { err }
    }
}