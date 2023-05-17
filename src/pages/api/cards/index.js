import { addCardToDeck } from "lib/prisma/cardController";


const addCardHandler = async (req, res)=>{
    if(req.method==='POST'){
        const cardData = req.body
        const response = await addCardToDeck(cardData)
        console.log(response)
        return res.status(200).json(response);
        
    }
    res.setHeader('Allow', ['POST']);
    res.status(425).end(`Method ${req.method} is not allowed.`);  
}





export default addCardHandler;