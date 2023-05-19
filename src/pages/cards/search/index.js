import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from '../../../styles/Cards.module.css'
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head";
import SideBar from "@/components/SideBar";
import DynamicHeader from "@/components/DynamicHeader";
import { ACTIONS } from "utils/actions";
import { useStateContext, useDispatchContext } from "utils/ReducerContext";
import { Suspense } from "react";
import useDebounce from "utils/useDebounce";
import { useRouter } from "next/router";
import SearchedCardsList from "@/components/SearchedCardsList";
import getAllCards from "utils/getAllCards";
import CardsDisplay from "@/components/CardsDisplay";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";



export default function SearchCards({initialCards}) {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const [cards, setCards] = useState([]);
    const [lastSearchQuery, setLastSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    

    const queryClient = useQueryClient();

    const router = useRouter();
    const debouncedSearch = useDebounce(state.searchInput, 500);
    

    function reCenterCardOnScreen(target) {
        let TIMER;
        if (!state.mediaState.matches && state.isExpanded) {
            TIMER = 800;
        }
        else {
            TIMER = 400;
        }
        if(target){
            setTimeout(() => {
                const rect = target.getBoundingClientRect();
                if (rect.top < 70 || rect.y > 700) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, TIMER)
        }
        return;
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
        if(router.query.q){
            dispatch({type: ACTIONS.SEARCH_INPUT, payload: router.query.q})
        }

        dispatch({ type: ACTIONS.MEDIA_STATE, payload: { matches: window.matchMedia("(max-width: 990px)").matches } })

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    useEffect(()=>{
        async function fetchUserInput(userInput) {
            try {
                setIsLoading(true);
                if(userInput != ''){
                    const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(userInput)}`)
                    if(response.ok){
                        const searchResult = await response.json();
                        setCards(searchResult.data)
                        dispatch({type: ACTIONS.NO_SEARCH_RESULT, payload: false})
                    }
                    if(!response.ok){
                        setCards([]);
                        dispatch({type: ACTIONS.NO_SEARCH_RESULT, payload: true})
                    }
                    setIsLoading(false);
                }
                
            } catch (err) {
                console.log(err)
            }
        }
        if(debouncedSearch){
            fetchUserInput(debouncedSearch);
        }
        if(debouncedSearch === ''){
            setCards([]);
        }
    },[debouncedSearch])
    useEffect(()=>{
          dispatch({type: ACTIONS.NO_SEARCH_RESULT, payload: false})
          router.replace(`/cards/search?q=${encodeURIComponent(state.searchInput)}`, undefined, {shallow: true, scroll: false})
          setLastSearchQuery(router.query.q)
    },[state.searchInput])


  

    const fetchCards = async (page=1)=>{
        const response = await fetch(`https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1&page=${page}`)
        return response.json();
    } 
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } = useInfiniteQuery(
        ['cards'], 
    ({pageParam})=> fetchCards(pageParam)  
    ,
    {
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return lastPage.has_more ? nextPage : undefined;
        }
    });
    
    // useEffect(()=>{
    //     console.log(data)
    //     let fetching = false;
    //     const handleScroll = async (e) =>{
    //         const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;

    //         // if(!fetching && scrollHeight - clientHeight >= scrollTop*6){
    //         //     console.log('hi')
                
    //         //     fetching = true;
    //         //     if(hasPreviousPage){
    //         //         await fetchPreviousPage();
    //         //     }
    //         //     fetching = false;
    //         // }

    //         if(!fetching && (scrollHeight - scrollTop <= (clientHeight * 2))){
    //             fetching = true;
    //             if(hasNextPage){
    //                 await fetchNextPage();
    //             }
    //             fetching = false;
                
    //         //     if(data.pages.length>2){
    //         //         queryClient.setQueryData(['cards'], (data) => {
                    
    //         //             data.pages.slice(1);
    //         //             data.pageParams.slice(1);
    //         //    })
    //         //     }
                
    //         }
    //     }
    //     document.addEventListener('scroll', handleScroll);

    //     return ()=> document.removeEventListener('scroll', handleScroll);
    // },[])

    
// console.log(data);
    return (
        <>
            <Head>
                <title>DeckBuilder</title>
            </Head>
            <Header />
             
            <DynamicHeader
                // position={handleDynamicHeader()}
            />
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
                        initial={false}
                    >
                                {state.searchInput ?
                                <SearchedCardsList cards={cards} styles={styles} handleCardSelectedStylesToggle={handleCardSelectedStylesToggle} isLoading={isLoading}/>
                                  
                                : 
                                <>
                                    {/* {initialCards.map((card) => {
                                        return <div
                                                    className={styles.card}
                                                    key={card.id}
                                                >
                                                    <LazyLoadImage
                                                        wrapperClassName={styles.cardImageWrapper}
                                                        effect="blur"
                                                        loading="lazy"
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
                                    })}  */}
                                {data.pages.map((page, i) => {
                                    return <CardsDisplay key={i} page={page} />
                                })}
                                </>}
                    </motion.div>
                </div>
            </Suspense>
            
        </>
    )
}

//&page=2  for page 2, etc.
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
        props: { initialCards: filteredCardPropsArray, symbols } 
    }
}
// export async function getStaticProps(){

//     const getAllCards = (url, nextPageUrl, prevResponse=[])=>{
//         return fetch(url)
//                 .then(response=> {return {data} = response.json()})
//                 .then(newResponse=> {
//                     const response = [...prevResponse, ...newResponse];

//                     if(newResponse.next_page){
//                         nextPageUrl = newResponse.next_page
//                         return getAllCards(url, nextPageUrl, response);
//                     }
//                     console.log(response);
//                     return response;
//                 });
//     }

//     const cards = getAllCards(WHITE_CARD_URL);
    
//     let filteredCardPropsArray = []
//     for(let i=0; i<cards.length; i++){
//         filteredCardPropsArray[i] = {
//             name: cards.data[i].name,
//             id : cards.data[i].id,
//             set_name: cards.data[i].set_name,
//             image: cards.data[i].image_uris?.border_crop || cards.data[i].card_faces[0].image_uris.border_crop,
//             backImage: cards.data[i].card_faces?.image_uris? cards.data[i].card_faces[1].image_uris : null,
//             cmc: cards.data[i].cmc,
//             description: cards.data[i].card_faces? cards.data[i].card_faces[0].oracle_text + ' ' + cards.data[i].card_faces[1].oracle_text : cards.data[i].oracle_text
//         };
//     };
//     const symbolResponse = await fetch(SYMBOL_URL)
//     const symbolsData = await symbolResponse.json();
//     const symbols = symbolsData.data

//     return { 
//         props: { initialCards: filteredCardPropsArray, symbols } 
//     }
// }