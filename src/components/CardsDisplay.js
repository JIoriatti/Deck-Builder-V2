import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component"
import styles from '../styles/Cards.module.css'
import { useDispatchContext, useStateContext } from "utils/ReducerContext"
import { useRef, useState, useEffect } from "react";


// ***** FIGURE OUT REF FOR NOT DISPLAYING CARDS OFF TOP OF SCREEN *********


// function useOnScreen(ref, rootMargin = "0px") {
//     const [isIntersecting, setIntersecting] = useState(false);
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           setIntersecting(entry.isIntersecting);
//         },
//         {
//           rootMargin,
//         }
//       );
//       if (ref.current) {
//         observer.observe(ref.current);
//       }
//       return () => {
//             observer.unobserve(ref.current);
//       };
//     }, []); 
//     console.log(isIntersecting)
//     console.log(ref.current)
//     return isIntersecting;
//   }


function CardsDisplay({page, scrollPosition}){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    // const cardsRef = useRef();
    // const onScreen = useOnScreen(cardsRef, '-300px');
    // const [cardsPage, setCardsPage] = useState(page)

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
    // useEffect(()=>{
    //     setCardsPage(page)
    //     if(page){
    //         cardsRef.current = cardsRef.current?.slice(0,page.data.length)
    //     }
        
    // },[page])
    return (
        <>
                {page.data.map((card, i) => {
                    return <div
                        className={styles.card}
                        key={card.id}>
                            {/* {!onScreen &&  */}
                            <LazyLoadImage
                            // ref={(card)= cardsRef.current[i] = card}
                            wrapperClassName={styles.cardImageWrapper}
                            effect='blur'
                            loading="lazy"
                            placeholderSrc="https://cards.scryfall.io/small/front/5/4/54cc4e2b-1497-4788-afb4-9e42b7683b5a.jpg?1643586842"
                            className={handleCardSelectedStylesToggle(card)}
                            scrollPosition={scrollPosition}
                            data-card="card"
                            data-name={card.name}
                            data-setname={card.set_name}
                            data-cmc={card.cmc}
                            data-desc={card.oracle_text}
                            data-id={card.id}
                            data-back={card.card_faces?.image_uris ? card.card_faces[1].image_uris : null}
                            data-doublesided={card.backImage ? 'true' : 'false'}
                            src={card.image_uris?.border_crop || card.card_faces[0].image_uris.border_crop}
                            alt={card.name}
                            key={card.name} />
                            {/* } */}
                        
                    </div>
                })}
        </>
    )
}

export default trackWindowScroll(CardsDisplay);