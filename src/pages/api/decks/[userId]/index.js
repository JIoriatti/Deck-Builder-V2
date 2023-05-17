import { findAllUserDecks } from "lib/prisma/deckController";


const userDecksHandler = async (req, res)=>{
    const query = req.query;
    const {userId} = query;
    console.log(userId)
    if(req.method === 'GET'){
        try{
            const userDecks = await findAllUserDecks(userId)
                console.log(userDecks)
                return res.status(200).json(userDecks);
            
        }catch(err){
            return res.status(500).json({message: err.message})
        }
    }
    res.setHeader('Allow', ['GET']);
    res.status(425).end(`Method ${req.method} is not allowed.`);
}

export default userDecksHandler;