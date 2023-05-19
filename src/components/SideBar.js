import Image from "next/image"
import styles from "../styles/SideBar.module.css"
import { AnimatePresence, motion } from "framer-motion"
import ExpandableDoor from "./ExpandableDoor"
import { useEffect, useState } from "react"
import BottomBar from "./BottomBar"
import { ACTIONS } from "utils/actions"
import { useStateContext, useDispatchContext } from "utils/ReducerContext"
import DeckList from "./DeckList"

export default function SideBar ({reCenterCardOnScreen}) {
    const [doubleNameCard, setDoubleNameCard] = useState(false);
    const [isRotateClicked, setIsRotateClicked] = useState(false);

    const state = useStateContext();
    const dispatch = useDispatchContext();

    const ADD_CARD_BOX_SHADOW = 'inset 0px 0px 10px lightgreen, inset 0px 0px 20px green, inset 0px 0px 30px green, inset 0px 0px 40px green'
    
    const setExpandedIfMediaChange =()=>{
        if(state.mediaState.matches){
            dispatch({type: ACTIONS.SET_EXPANDED});
        }
    }
    const addCardToDeck = async () =>{
        const { name, id } = state.selectedCardDetails;
        await fetch('/api/cards',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cardname: name, scryfallId: id, deckId: state.selectedDeckId})
        })
    }
    useEffect(()=>{
        const doubleForwardSlashRegEx = /\s\/\/\s/i;
        const cardNameToBeChecked = state.selectedCardDetails.name
        if(doubleForwardSlashRegEx.test(cardNameToBeChecked)){
            setDoubleNameCard(true);
        }
        else{
            setDoubleNameCard(false);
        }
    },[state.selectedCardDetails])

    useEffect(()=>{
        setIsRotateClicked(false);
    },[doubleNameCard])

    useEffect(()=>{
        const mediaHandler = (e)=> dispatch({type: ACTIONS.MEDIA_STATE, payload: {matches: e.matches}});
        window.matchMedia("(max-width: 990px)").addEventListener('change',mediaHandler);
        setExpandedIfMediaChange();

        return ()=> window.matchMedia("(max-width: 990px)").removeEventListener('change',mediaHandler);
    },[])

    return(
        <>
            <motion.aside
                animate={state.mediaState.matches ? { opacity: state.isCardClicked ? 1 : 0, bottom: state.isCardClicked ? "0px" : '-500px', left: '0px'}
                    : { opacity: state.isCardClicked ? 1 : 0, left: state.isCardClicked ? "initial" : '-500px' }}
                transition={state.transition}
                className={styles.sideBar}
                initial={false}
            >   
            <AnimatePresence>
                {state.isAddCardClicked &&
                    <motion.div 
                        className={styles.cardAddedDropDown}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.2}}
                        exit={{opacity: 0}}
                        // style={{left: state.mediaState.matches? '40%': 'initial'}}
                    >Card Added!
                    </motion.div>
                }
            </AnimatePresence>
                <motion.div 
                    className={styles.cardInfoContainer}
                    animate={{boxShadow: state.isAddCardClicked ? ADD_CARD_BOX_SHADOW : 'none'}}
                    transition={{duration: 0.05, repeat: 1, repeatType: 'reverse', repeatDelay: 1}}
                    onAnimationComplete={()=> dispatch({type: ACTIONS.ADD_CARD_CLICKED, payload: false})}
                >
                    <div className={styles.mobileImageNameSetNameWrapper}>
                        <div className={styles.imageContainer}>
                            {doubleNameCard && !state.mediaState.matches && <div className={styles.dualSidedOptions}>
                                <button
                                    className={styles.turnCard}
                                    type='button'
                                    onClick={() => setIsRotateClicked(!isRotateClicked)}>
                                </button>
                            
                                {state.selectedCardDetails.doubleSided === 'true' &&
                                    <>
                                        <span className={styles.vertSeperator}></span>
                                        <button
                                            className={styles.flipCard}
                                            type='button'>
                                        </button>
                                    </>}
                            </div>}
                            <motion.img
                                src={state.selectedCardDetails.imageSrc}
                                className={styles.cardImage}
                                alt={state.selectedCardDetails.name}
                                id='sideBarImage'
                                animate={{ rotate: isRotateClicked ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                title='View Card Details'
                                onClick={()=> window.location.assign(`/cards/${state.selectedCardDetails.id}`)}
                            >
                            </motion.img>
                        </div>
                        {state.mediaState.matches ? 
                        <div className={styles.mobileWrapper}>
                            <h1 className={styles.cardName}>{state.selectedCardDetails.name}</h1>
                            <span className={styles.seperatorLrg}></span>
                            <span className={styles.seperatorMed}></span>
                            <span className={styles.seperatorSml}></span>
                            <span className={styles.seperatorVSml}></span>
                            <h2 className={styles.setName}>{state.selectedCardDetails.set_name}</h2>
                            <span className={styles.seperatorLrg}></span>
                            <span className={styles.seperatorMed}></span>
                            <span className={styles.seperatorSml}></span>
                            <div className={styles.mobileTurnCardCMCWrapper}>
                                <p className={styles.cmc}>CMC: {state.selectedCardDetails.cmc}</p>
                                {doubleNameCard && 
                                <button
                                    className={styles.turnCard}
                                    type='button'
                                    onClick={() => setIsRotateClicked(!isRotateClicked)}>
                                </button>}
                            </div>
                        </div> : 
                        <>
                            <h1 className={styles.cardName}>{state.selectedCardDetails.name}</h1>
                            <span className={styles.seperatorLrg}></span>
                            <span className={styles.seperatorMed}></span>
                            <span className={styles.seperatorSml}></span>
                            <span className={styles.seperatorVSml}></span>
                            <h2 className={styles.setName}>{state.selectedCardDetails.set_name}</h2>
                            <span className={styles.seperatorLrg}></span>
                            <span className={styles.seperatorMed}></span>
                            <span className={styles.seperatorSml}></span>
                        </>}
                    </div>
                    <p className={styles.description}>{state.selectedCardDetails.description}</p>
                    {state.mediaState.matches ? null : <p className={styles.cmc}>CMC: {state.selectedCardDetails.cmc}</p>}
                </motion.div>
                <DeckList />
                <div className={styles.bottomContainer}>
                    <div className={styles.stickyBottom}>
                        <div className={styles.addCardDeckContainer}>
                            <button
                                className={styles.addToDeck}
                                type='button'
                                title="Add Card To Deck"
                                id='addToDeck'
                                onClick={()=> {
                                    addCardToDeck();
                                    dispatch({type: ACTIONS.ADD_CARD_CLICKED, payload: true})
                                }}
                            >
                            </button>
                            <button
                                className={styles.deckList}
                                type='button'
                                title="View Deck List"
                                id="viewDeckList"
                                onClick={() => dispatch({type: ACTIONS.VIEW_DECK_LIST})}
                            >
                            </button>
                        </div>
                        {state.mediaState.matches && <BottomBar />}
                        <div className={styles.rightSideContainer}>
                            <div className={styles.dismissExpandContainer}>
                                <button
                                    className={styles.dismiss}
                                    type='button'
                                    title="Close Card-Viewer"
                                    id="close"
                                    onClick={() => {
                                        dispatch({type: ACTIONS.SET_LAST_SELECTED_CARD, payload: state.selectedCard})
                                        reCenterCardOnScreen(state.selectedCard);
                                        dispatch({type: ACTIONS.SET_SELECTED_CARD, payload: {}});
                                        dispatch({type: ACTIONS.DISMISSED})
                                        dispatch({type: ACTIONS.IS_CARD_CLICKED, payload: false})
                                        if(state.isExpanded){
                                            dispatch({type: ACTIONS.SET_TRANSITION, payload: { ease: "easeInOut", duration: 0.3, delay: 0.5 }})
                                            dispatch({type: ACTIONS.SET_EXPANDED})
                                        }
                                        else{
                                            dispatch({type: ACTIONS.SET_TRANSITION, payload: { ease: "easeInOut", duration: 0.3 }})
                                        }
                                    }}
                                >
                                </button>
                                {state.mediaState.matches ? null : 
                                <motion.button
                                    className={styles.expand}
                                    animate={{rotate: state.isExpanded? -180 : 0}}
                                    transition={{duration: 0.05}}
                                    type='button'
                                    title={state.isExpanded? "Collapse Card-History" : "Expand Card-History"}
                                    id="expand"
                                    onClick={() => {
                                        dispatch({type: ACTIONS.SET_EXPANDED})
                                    }}
                                >
                                </motion.button> }
                            </div>
                        </div>
                    </div>
                    {state.mediaState.matches ? null :<ExpandableDoor />}
                </div>
                {state.mediaState.matches ? null : 
                <BottomBar />}
            </motion.aside>
        </>
    )
}