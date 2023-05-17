import React, {useContext, useReducer} from "react";
import { reducer } from "./reducer";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

export function useStateContext(){
    return useContext(StateContext);
} 
export function useDispatchContext(){
    return useContext(DispatchContext);
}

export default function ReducerProvider ({children}){
    const [state, dispatch] = useReducer(reducer, {
        selectedCard: {},
        selectedCardDetails: {},
        isCardClicked: false,
        lastSelectedCard: {},
        transition: {},
        searchInput: '',
        isExpanded: false,
        isSearchExpanded: false,
        scrollYPosition: 0,
        mediaState: {},
        cardHistory: [],
        isDismissed: true,
        isViewDeckListClicked: false,
        isAddCardClicked: false,
        selectedDeckId: '',
        noSearchResult: false,
    });

return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    </StateContext.Provider>
)
}