import { getAllCardsFromDeck } from "lib/prisma/cardController";


const getAllCardsFromDeckHandler = async (req, res)=>{
    const query = req.query;
    const { deckId } = query
    if(req.method==='GET'){
        const cardsInDeck = await getAllCardsFromDeck(deckId)
        
        return res.status(200).json(cardsInDeck);
    }
    res.setHeader('Allow', ['GET']);
    res.status(425).end(`Method ${req.method} is not allowed.`);  
}





export default getAllCardsFromDeckHandler;