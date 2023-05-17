import styles from '../styles/Search.module.css'
import React from 'react';
import { ACTIONS } from 'utils/actions';
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import { AnimatePresence, motion } from 'framer-motion';


export default function Search () {
    const state = useStateContext();
    const dispatch = useDispatchContext();

    return( 
        <>
            <AnimatePresence>
                {state.isSearchExpanded && 
                    <motion.div 
                    className={styles.searchWrapper}
                    initial={{scaleX: 0, originX: 1}}
                    animate={{scaleX: 1, originX: 1}}
                    transition={{duration: 0.2}}
                    >
                        <input
                            type="search"
                            id='searchInput'
                            className={styles.searchInput}
                            placeholder='Cards, Types, Sets'
                            autoFocus={true}
                            onBlur={()=> {
                                if(!state.searchInput){
                                    dispatch({type: ACTIONS.IS_SEARCH_EXPANDED})
                                    dispatch({type: ACTIONS.SEARCH_INPUT, payload: ''})
                                    dispatch({type: ACTIONS.NO_SEARCH_RESULT, payload: false})
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => dispatch({type: ACTIONS.SEARCH_INPUT, payload: e.target.value})}
                            value={state.searchInput}
                        />
                        <div
                            className={styles.searchBarIcon2}
                        >
                        </div>
                    </motion.div>
                }
            
            {!state.isSearchExpanded && 
                <button
                    className={styles.searchBarIconContainer}
                    title='Search'
                    type='submit'
                    onClick={()=> dispatch({type: ACTIONS.IS_SEARCH_EXPANDED})}
                >
                    <div
                        className={styles.searchBarIcon}
                    >
                    </div>
                </button>
            }
            </AnimatePresence>
        </>    
    )
}