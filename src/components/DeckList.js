import styles from '../styles/DeckList.module.css'
import { getSession, useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react';
import { useDispatchContext,useStateContext } from 'utils/ReducerContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ACTIONS } from 'utils/actions';

export default function DeckList (){
    const {data: session, status} = useSession({required: true});
    const [userDecks, setUserDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const state = useStateContext();
    const dispatch = useDispatchContext();

    const getUserDecks = async ()=>{
        let deckArray =[];
        //added getSession due to session object being undefined on page load/hard reload
        //may not be needed for production as hot reload doesnt cause session to be undefined
        const session = await getSession();
            console.log('working')
            const userId = session.user.id
            const response = await fetch(`/api/decks/${userId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const deckData = await response.json();
            for(let deck of deckData.decks){
                deckArray.push({name: deck.name, id: deck.id});
            }
            setUserDecks(deckArray);
            return;
  
    }
    const handleDeckClickStyles = (deck)=>{
        if(state.selectedDeckId === deck.id){
            return styles.deckname + ' ' + styles.selected
        }
        else{
            return styles.deckname
        }  
    }
    
    useEffect(()=>{
        getUserDecks();
    },[])

    return (
        <>
            <AnimatePresence>
                {status === 'authenticated' && state.isViewDeckListClicked &&
                    <motion.div
                        className={styles.mainContainer}
                        initial={{bottom: 0}}
                        animate={{bottom: state.mediaState.matches? '70px' : '128px'}}
                        transition={{duration: 0.2}}
                        exit={{bottom: state.mediaState.matches? '-100px': '-50px'}}

                    >
                        <div className={styles.decksHeader}> Decks </div>
                        <div className={styles.decknamesContainer}>
                            {userDecks.map((deck, index)=>{
                                return <span 
                                            className={handleDeckClickStyles(deck)} 
                                            key={index}
                                            data-id={deck.id} 
                                            onClick={(e)=> {
                                                dispatch({type: ACTIONS.SET_SELECTED_DECK_ID, payload: e.target.dataset.id})
                                            }}
                                        >
                                            {deck.name}
                                        </span>
                            })}
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
      
    )
}
