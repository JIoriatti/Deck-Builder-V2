import styles from '../styles/BottomBar.module.css'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { ACTIONS } from 'utils/actions';
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';


function BottomBar (){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    
    const handleClick =(e)=>{
        dispatch({type: ACTIONS.SET_SELECTED_CARD_DETAILS, payload: state.cardHistory.find((card)=> card.name === e.target.alt) })
    }
    const handleSideScroll = (e)=> { 
        e.preventDefault();
        document.querySelector('#bottomBar').scrollLeft += e.deltaY;
    }
    const handleResize =() =>{
        const bottomBar = document.querySelector('#bottomBar');

        bottomBar.scrollLeft = bottomBar.scrollWidth;
    }
    
    useEffect(()=>{
        if(!state.cardHistory.find((card)=> card.id === state.selectedCardDetails?.id)){
            dispatch({type: ACTIONS.CARD_HISTORY, payload: {cardHistory: state.cardHistory, selectedCardDetails: state.selectedCardDetails}})
        }
    },[state.selectedCardDetails])

    useEffect(()=>{
        const bottomBar = document.querySelector('#bottomBar');

        bottomBar.addEventListener('wheel', handleSideScroll);
        return ()=> bottomBar.removeEventListener('wheel', handleSideScroll);
    },[])

    useEffect(()=>{
        handleResize();
    },[state.cardHistory])

    return( 
        <>
            {state.mediaState.matches ?
                <motion.div
                    className={styles.bottomBar}
                    id='bottomBar'>
                    <div className={styles.miniCardWrapper}>
                        {state.cardHistory.filter((card) => {
                            if (!Object.keys(card).length == 0) {
                                return card;
                            }
                        })
                            .map((card, i) => {
                                return <motion.img
                                    src={card.imageSrc}
                                    alt={card.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ ease: "easeInOut", duration: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    className={styles.miniCard}
                                    key={i}
                                    onClick={handleClick}
                                    id={'miniCard- ' + card.id} />
                            })}
                    </div>
                </motion.div>
                :
                <motion.div
                    className={styles.bottomBar}
                    animate={{ left: state.isExpanded ? '0' : '-100vw' }}
                    initial={{ delay: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.3, delay: 0.1 }}
                    id='bottomBar'>
                    <div className={styles.spacer}></div>
                    <div className={styles.miniCardWrapper}>
                        {state.isExpanded && state.cardHistory.filter((card) => {
                            if (!Object.keys(card).length == 0) {
                                return card;
                            }
                        })
                            .map((card, i) => {
                                return <motion.img
                                    src={card.imageSrc}
                                    alt={card.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ ease: "easeInOut", duration: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    className={styles.miniCard}
                                    key={i}
                                    onClick={handleClick}
                                    id={'miniCard- ' + card.id} />
                            })}
                    </div>
                </motion.div>}
        </>
    )
}
export default trackWindowScroll(BottomBar);