import { useDispatchContext, useStateContext } from "utils/ReducerContext"
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function SearchedCardsList({cards, styles, handleCardSelectedStylesToggle, isLoading}){
    const state = useStateContext();
    const dispatch = useDispatchContext();

    if (state.searchInput && cards.length > 1) {
        return (
            <>
                    {cards.map((card) => {
                        return <div
                            className={styles.card}
                            key={card.id}>
                            <LazyLoadImage
                                wrapperClassName={styles.cardImageWrapper}
                                effect="blur"
                                placeholderSrc={card.image_uris?.border_crop || card.card_faces[0].image_uris.border_crop}
                                className={handleCardSelectedStylesToggle(card)}
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
                        </div>
                    })}
            </>

        )
    }
    
    if(state.noSearchResult){
        return <div>No results found.</div>
    }

    // if(!state.noSearchResult || isLoading){
    //     return <div>Loading...</div>
    // }
    else{
        return <div>Loading...</div>
    }
}