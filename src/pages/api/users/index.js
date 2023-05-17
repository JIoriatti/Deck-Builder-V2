import { createUser, getUsers } from "lib/prisma/userController";

const userHandler = async (req, res) =>{
    if(req.method === 'GET'){
        try{
            const { users, error } = await getUsers();
            if(error){
                throw new Error(error);
            }
            return res.status(200).json({users})
        }catch(err){
            return res.status(500).json({error: err.message})
        }
    }
    if(req.method === 'POST'){
        try{
            const data = req.body
            const { userData, error } = await createUser(data);
            if(error){
                throw new Error(error);
            }
            return res.status(200).json({user: userData})
        }catch(err){
            return res.status(500).json({error: err.message})
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(425).end(`Method ${req.method} is not allowed.`);
}

export default userHandler