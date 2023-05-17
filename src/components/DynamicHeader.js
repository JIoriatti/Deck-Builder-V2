import styles from '../styles/DynamicHeader.module.css'
import Search from "./Search"
import ProfileButton from "./ProfileButton"
import { useStateContext, useDispatchContext } from "utils/ReducerContext"
import { AnimatePresence, motion } from 'framer-motion'
import ColorFilter from './ColorFilter'

export default function DynamicHeader({position}) {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    return (
        <div 
            className={styles.outerWrapper}
        >
                <header
                className={styles.dynamicHeader}
                // style={position}
                >
                <AnimatePresence>
                    {state.scrollYPosition != 0 && 
                    <motion.div 
                        className={styles.background}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration:0.35}}
                        exit={{opacity: 0}}
                    >
                    </motion.div> 
                }
                </AnimatePresence>
                <ProfileButton />
                <div 
                    className={styles.centeringWrapper}
                >
                    <h1
                        className={styles.appName}
                    >Deck Builder
                    </h1>
                    <nav className={styles.navigation}>
                    </nav>
                    <Search/>
                </div>
                {/* <ColorFilter /> */}
            </header>
        </div>
        
    )
}