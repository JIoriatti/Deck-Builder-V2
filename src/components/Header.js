import styles from '../styles/Header.module.css'
import Search from "./Search";
import ProfileButton from "./ProfileButton";
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import ColorFilter from './ColorFilter';

export default function Header(){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    return(   
        <div className={styles.mainContainer}>
            <header
                className={styles.header}
            >
                {/* <div className={styles.psuedoItem}></div>
                <div className={styles.searchFilterContainer}>
                    <ColorFilter />
                    <Search
                        isSearchExpanded={state.isSearchExpanded}
                        searchInput={state.searchInput}
                        dispatch={dispatch}
                        // style={}
                    />
                </div>
                <div className={styles.rightContainer}>
                    <h1 className={styles.appName}>Deck Builder</h1>
                    <nav className={styles.navigation}>
                    </nav>
                </div>
                <ProfileButton />   */}
            </header>
            <span className={styles.seperator}></span>
        </div>
        
    )
}