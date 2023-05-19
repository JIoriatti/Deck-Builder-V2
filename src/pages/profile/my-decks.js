import { useEffect, useState } from "react";
import styles from '../../styles/MyDecks.module.css'
import { getSession, useSession } from "next-auth/react";


export default function MyDecks(){
    const [show, setShow] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [userDecks, setUserDecks] = useState([]);
    const [cardsInSelectedDeck, setCardsInSelectedDeck] = useState([]);
    const {data: session, loading} = useSession();


    const fetchUserDecks = async ()=>{
        let deckArray =[];
        const session = await getSession();
        const response = await fetch(`/api/decks/${session.user.id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const fetchedDecks = await response.json();
        for(let deck of fetchedDecks.decks){
            deckArray.push({name: deck.name, id: deck.id});
        }
        return deckArray;
    }

    const handleDeckClick = async (e) =>{
        let cardsArray = [];
        const response = await fetch(`/api/cards/${e.target.dataset.id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const cardsInDeck = await response.json();
        if(cardsInDeck.cards.length>0){
            for(let card of cardsInDeck.cards){
                cardsArray = [...cardsArray, card]
            }
            return setCardsInSelectedDeck(cardsArray);
        }
        return
    }
    const handleChange = (e) =>{
        setUserInput(e.target.value)
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(userInput != ''){
            try{
                fetch('/api/decks',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: session.user.id, deckname: userInput}),
                }).then((response)=>{
                    // console.log(response)
                })
            }catch(err){
                console.log(err)
            }
        }
        else{
            return prompt('error')
        }
        setUserDecks((prevDecks)=> [...prevDecks, userInput]);
        setUserInput('')
    }

    useEffect(()=>{
        const getUserDecks = async ()=>{
            const decks = await fetchUserDecks();
            setUserDecks(decks);
        }
        getUserDecks();
    },[])

    return(
        <div className={styles.container}>
            <form
                onSubmit={handleSubmit}
            >
                <input 
                    type="text"
                    id="input"
                    onChange={handleChange}
                    value={userInput}   
                />
                
                <button
                    type="submit"
                    onSubmit={handleSubmit}
                >
                Submit
                </button>
            </form>
            
            <button
                className={styles.myDecks}
                tabIndex={1}
                type="button"
                onClick={()=> setShow(!show)}
            >My Decks
            </button>
            <div className={styles.deckCardContainer}>
                <div className={styles.deckContainer}>
                    {show && userDecks.map((deck)=>{
                        return <h3 
                                    className={styles.deckName}
                                    key={deck.id}
                                    data-id={deck.id}
                                    onClick={handleDeckClick}
                                    >
                                    {deck.name}
                                </h3>
                    })}
                
                </div>
                <div className={styles.cardList}>
                    {show && cardsInSelectedDeck.length>0 ? cardsInSelectedDeck.map((card,index)=>{
                    
                            return <span
                                        key={index}
                                        className={styles.cardname}
                                        >
                                        {card.name}
                                    </span>
                        

                    }) :
                    <span>
                    No cards in selected deck.    
                    </span>}
                </div>
            </div>
            
            
 

        </div>
    )
}