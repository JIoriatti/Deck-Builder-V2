import { createDeck, deleteDeck} from "lib/prisma/deckController";



const deckHandler = async (req, res) =>{
    if(req.method === 'POST'){
        try{
            //req.body is just a deckname in this case
            const data = req.body;
            const deckCreation = await createDeck(data)
            return res.status(200).json({deckCreation})
        }catch(err){
            return res.status(500).json({message: err.message})
        }
    }
    if(req.method === 'DELETE'){
        try{
            const deckId = req.params.id;
            const { deckDeletionData, error } = await deleteDeck(deckId);
            if(error){
                throw new Error(error);
            }
            return res.status(200).json({deckDeletionData});
        }catch(err){
            return res.status(500).json({message: err.message})
        }
    }
    else{
        res.setHeader('Allow', ['POST', 'DELETE']);
        // res.status(425).end(`Method ${req.method} is not allowed.`);
    }
    
}

export default deckHandler;