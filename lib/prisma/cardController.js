import prisma from ".";

export async function addCardToDeck(data){
    try{
        const card = await prisma.card.create({
            data: {
                name: data.cardname,
                scryfallId: data.scryfallId,
                deckId: data.deckId,
            },
        })
        return card
    }catch(err){
        return { err }
    }
}
export async function getAllCardsFromDeck(deckId){
    try{
        const cards = await prisma.deck.findUnique({
            where: {
                id: deckId,
            },
            select: {
                cards: true,
            }
        })
        return cards
    }catch(err){
        return { err }
    }
}