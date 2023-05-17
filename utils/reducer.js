import { ACTIONS } from "./actions"

export const reducer = (state, action)=>{
    switch(action.type){
        case ACTIONS.SET_SELECTED_CARD:
            return { ...state, selectedCard: action.payload}
        case ACTIONS.SET_SELECTED_CARD_DETAILS:
            return { ...state, selectedCardDetails: action.payload}
        case ACTIONS.SET_LAST_SELECTED_CARD:
            return {...state, lastSelectedCard: action.payload}
        case ACTIONS.IS_CARD_CLICKED:
            return {...state, isCardClicked: action.payload? action.payload : !state.isCardClicked}
        case ACTIONS.SET_TRANSITION:
            return {...state, transition: action.payload}
        case ACTIONS.SEARCH_INPUT:
            return {...state, searchInput: action.payload}
        case ACTIONS.SET_EXPANDED:
            return {...state, isExpanded: !state.isExpanded }
        case ACTIONS.DISMISSED:
            return {...state, isDismissed: !state.isDismissed}
        case ACTIONS.IS_SEARCH_EXPANDED:
            return {...state, isSearchExpanded: !state.isSearchExpanded}
        case ACTIONS.SCROLL_Y_POSITION:
            return {...state, scrollYPosition: action.payload}
        case ACTIONS.MEDIA_STATE:
            return {...state, mediaState: action.payload}
        case ACTIONS.CARD_HISTORY:
            return {...state, cardHistory: setCardHistory(action.payload.cardHistory, action.payload.selectedCardDetails) }
        case ACTIONS.VIEW_DECK_LIST:
            return {...state, isViewDeckListClicked: !state.isViewDeckListClicked}
        case ACTIONS.ADD_CARD_CLICKED:
            return {...state, isAddCardClicked: action.payload}
        case ACTIONS.SET_SELECTED_DECK_ID:
            return {...state, selectedDeckId: action.payload}
        case ACTIONS.NO_SEARCH_RESULT:
            return {...state, noSearchResult: action.payload}
        default:
            throw new Error();
    }
}

export function setCardHistory(prevCardsArray, payload){
    return [...prevCardsArray, payload]
} 