import prisma from ".";


export async function createDeck(userData){
    try{
        const deckData = await prisma.deck.create({
            data: {
                    name: userData.deckname,
                    creatorId: userData.id,
                }
        })
        return { Newly_Added_Deckname: deckData};
    }
    catch(err){
        return { err }
    }
}

export async function deleteDeck(deckId){
    try{
        const deckData = await prisma.deck.delete({
            where: {
                id: deckId
            }
        })
        if(!deckData){
            throw new Error('Something went wrong.')
        }
        const cardsInDeckData = await prisma.card.deleteMany({
            where: {
                deckId: deckId,
            }
        })
        return { Deletion_message: `${deckname} and associated cards deleted successfully!` }
    }catch(err){
        return { err }
    }
}

export async function findAllUserDecks(userId){
    try{
        const userDecks = await prisma.user.findUnique({
            where:{
                id: `${userId}`
            },
            select: {
                decks: true,
            }
        })
        return  userDecks;
    }catch(err){
        return { err }
    }
}