const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const WHITE_CARD_URL = "https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1";


async function main(){
    
    const getAllCards = (url, nextPageUrl, prevResponse = []) => {
        return fetch(url)
            .then(response =>response.json())
            .then(newResponse => {
                const response = [...prevResponse, ...newResponse.data];

                if (newResponse.next_page) {
                    nextPageUrl = newResponse.next_page
                    return getAllCards(url, nextPageUrl, response);
                }
                console.log(response);
                return response;
            }).catch(err => console.log(err));
    }
    const allCards = await getAllCards(WHITE_CARD_URL);
    const filteredPropsCards = allCards.map((card,i,array)=> {
        return array[card] = {
            name: card.name, scryfallId: card.id, released_at: card.released_at, mana_cost: card.mana_cost,
            type_line: card.type_line, oracle_text: card.oracle_text, power: card.power, toughness: card.toughness,
            colors: card.colors, color_identity: card.color_identity, rarity: card.rarity, set_name: card.set_name,
            set_type: card.set_type 
        }
    })

    const DBresponse = await prisma.card.createMany({
        data: filteredPropsCards,
    })
    console.log(DBresponse);
}
main().then(async()=>{
    await prisma.$disconnect();
})
.catch(async(e)=>{
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
})