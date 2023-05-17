import { AnimatePresence, motion } from "framer-motion"
import { useStateContext, useDispatchContext } from "utils/ReducerContext";

export default function AnimationWrapper({children, classname}){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    return(
        <>
            <AnimatePresence>
                {state.isSearchExpanded && (
                    <motion.div
                    className={classname}
                    initial={{opacity: 0,}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration:0.1}}
                >
                    {children}
                </motion.div>
                )}
                
            </AnimatePresence>
        </>
    )
}