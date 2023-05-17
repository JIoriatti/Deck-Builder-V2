import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from '../../styles/Cards.module.css'
import Header from "@/components/Header";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head";
import SideBar from "@/components/SideBar";
import DynamicHeader from "@/components/DynamicHeader";
import { ACTIONS } from "utils/actions";
import { useStateContext, useDispatchContext } from "utils/ReducerContext";
import Arrow from "@/components/Arrow";
import { Suspense } from "react";


export default function Cards({ cards }) {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    

    function reCenterCardOnScreen(target) {
        let TIMER;
        console.log(target);
        if (!state.mediaState.matches && state.isExpanded) {
            TIMER = 800;
        }
        else {
            TIMER = 400;
        }
        if(target && !state.searchInput){
            setTimeout(() => {
                const rect = target.getBoundingClientRect();
                if (rect.top < 70 || rect.y > 700) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, TIMER)
        }
        return;
    }
    const handleDynamicHeader = () => {
        let offset = (state.scrollYPosition - 120) / 1.5;
        if (state.searchInput) {
            return { top: '0' }
        }
        return state.scrollYPosition >= 120 ? { top: '0' } : { top: offset }
    }
    const handleScroll = (e) => {
        dispatch({ type: ACTIONS.SCROLL_Y_POSITION, payload: e.currentTarget.pageYOffset })
    }
    const handleCardClick = (e) => {
        if (e.target.dataset.card) {
            dispatch({ type: ACTIONS.SET_SELECTED_CARD, payload: e.target })
            dispatch({
                type: ACTIONS.SET_SELECTED_CARD_DETAILS, payload: {
                    name: e.target.alt,
                    set_name: e.target.dataset.setname,
                    cmc: e.target.dataset.cmc,
                    imageSrc: e.target.src,
                    backImage: e.target.dataset.backImage ? e.target.dataset.backImage : null,
                    doubleSided: e.target.dataset.doublesided,
                    description: e.target.dataset.desc,
                    id: e.target.dataset.id
                }
            })
            dispatch({ type: ACTIONS.IS_CARD_CLICKED, payload: true })
            dispatch({ type: ACTIONS.DISMISSED })
            if (e.target.dataset.name != state.selectedCard) {
                dispatch({ type: ACTIONS.SET_LAST_SELECTED_CARD, payload: state.selectedCard })
            }
            console.log(state.selectedCardDetails)
        }
        reCenterCardOnScreen(e.target);
    }
    const handleCardSelectedStylesToggle = (card) => {
        if (state.selectedCard.dataset?.name === card.name) {
            return styles.cardImage + ' ' + styles.selected + ' ' + styles.noHover;
        }
        else if (state.lastSelectedCard.dataset?.name === card.name) {
            return styles.cardImage + ' ' + styles.lastSelected + ' ' + styles.noHover;
        }
        else {
            return styles.cardImage;
        }
    }

    useEffect(() => {
        if (state.isCardClicked) {
            dispatch({ type: ACTIONS.SET_TRANSITION, payload: { ease: "easeInOut", duration: 0.4, delay: 1 } })

        }
        if (state.isCardClicked && !state.searchInput) {
            dispatch({ type: ACTIONS.SET_TRANSITION, payload: { ease: "easeInOut", duration: 0.2 } })
        }
        else {
            dispatch({ type: ACTIONS.SET_TRANSITION, payload: { ease: "easeInOut", duration: 0.4 } })
        }
    }, [state.isCardClicked])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    useEffect(() => {
        dispatch({ type: ACTIONS.MEDIA_STATE, payload: { matches: window.matchMedia("(max-width: 990px)").matches } })
    }, [])

    return (
        <>
            <Head>
                <title>DeckBuilder</title>
            </Head>
            <Header />
            {/* <Arrow /> */}
            <AnimatePresence>
                {state.scrollYPosition > 50 &&
                    <DynamicHeader
                        position={handleDynamicHeader()}
                    />
                }
            </AnimatePresence>
            <SideBar
                reCenterCardOnScreen={reCenterCardOnScreen}
            />
            <Suspense fallback={<p>Loading cards...</p>}>
                <div
                    className={styles.mainContainer}
                    id="mainContainer"
                >
                    <motion.div
                        animate={state.mediaState.matches ? { height: '100%' } : { width: state.isCardClicked ? '70%' : '96%', height: state.searchInput ? '80%' : 'initial' }}
                        transition={state.transition}
                        className={styles.cardsContainer + ' ' + (state.isExpanded ? styles.padBot : '')}
                        id="cardsContainer"
                        onClick={handleCardClick}
                    >
                        {state.searchInput ?
                            <>{cards.filter((card) => {
                                return state.searchInput.toLowerCase() === '' ?
                                    card :
                                    card.name.toLowerCase().includes(state.searchInput);
                            }).map((card) => {
                                return <div
                                    className={styles.card}
                                    key={card.id}>
                                    <LazyLoadImage
                                        effect="blur"
                                        className={handleCardSelectedStylesToggle(card)}
                                        data-card="card"
                                        data-name={card.name}
                                        data-setname={card.set_name}
                                        data-cmc={card.cmc}
                                        data-desc={card.description}
                                        data-id={card.id}
                                        data-back={card.backImage}
                                        data-doublesided={card.backImage ? 'true' : 'false'}
                                        src={card.image}
                                        alt={card.name}
                                        key={card.name}
                                    />
                                </div>
                            })}
                            </>
                            : <>
                                {cards.map((card) => {
                                    return <div
                                        className={styles.card}
                                        key={card.id}>
                                        <LazyLoadImage
                                            height={"100%"}
                                            width={'100%'}
                                            effect="blur"
                                            className={handleCardSelectedStylesToggle(card)}
                                            data-card="card"
                                            data-name={card.name}
                                            data-setname={card.set_name}
                                            data-cmc={card.cmc}
                                            data-desc={card.description}
                                            data-id={card.id}
                                            data-back={card.backImage}
                                            data-doublesided={card.backImage ? 'true' : 'false'}
                                            src={card.image}
                                            alt={card.name}
                                            key={card.name} />
                                    </div>
                                })}</>}
                    </motion.div>
                </div>
            </Suspense>
            
        </>
    )
}

const WHITE_CARD_URL = "https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1";
const SYMBOL_URL = "https://api.scryfall.com/symbology"
//Filtering out unwanted card object properties from the API to reduce amount of data being stored into props
//which fixed data>=128kb error from next
export async function getStaticProps(){
    const whiteCardResponse = await fetch(WHITE_CARD_URL)
    const cards = await whiteCardResponse.json();
    let filteredCardPropsArray = []
    for(let i=0; i<cards.data.length; i++){
        filteredCardPropsArray[i] = {
            name: cards.data[i].name,
            id : cards.data[i].id,
            set_name: cards.data[i].set_name,
            image: cards.data[i].image_uris?.border_crop || cards.data[i].card_faces[0].image_uris.border_crop,
            backImage: cards.data[i].card_faces?.image_uris? cards.data[i].card_faces[1].image_uris : null,
            cmc: cards.data[i].cmc,
            description: cards.data[i].card_faces? cards.data[i].card_faces[0].oracle_text + ' ' + cards.data[i].card_faces[1].oracle_text : cards.data[i].oracle_text
        };
    };
    const symbolResponse = await fetch(SYMBOL_URL)
    const symbolsData = await symbolResponse.json();
    const symbols = symbolsData.data

    return { 
        props: { cards: filteredCardPropsArray, symbols } 
    }
}