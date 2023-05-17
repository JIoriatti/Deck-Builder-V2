
import styles from '../styles/SideBar.module.css'
import { motion } from "framer-motion"
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';

export default function ExpandableDoor(){
    const state = useStateContext();
    const dispatch = useDispatchContext();

    let transition ={};
    if(state.isExpanded){
        transition = { ease: "easeInOut", duration: 0.1 }
        
    }
    else{
        transition = { ease: "easeInOut", duration: 0.2, delay: 0.4 }
    }
    return(
        <>
            <motion.div 
                className={styles.door}
                animate={{ height: state.isExpanded ? "0" : '100%'}}
                transition={transition}>
            </motion.div>
        </>
    )
}