import styles from '../styles/Arrow.module.css'
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Arrow (){
    const [isArrowClicked, setIsArrowClicked] = useState(false);
    return (
        <>
            <motion.div
                className={styles.arrowContainer}
                onClick={() => setIsArrowClicked(!isArrowClicked)}
                animate={{translateX: isArrowClicked? -100: 0, rotateY: isArrowClicked ? 180 : 0, border: isArrowClicked? '1px solid gold' : null}}
                transition={{duration: 0, ease: 'easeInOut', type: 'spring'}}
            >
            </motion.div>
            {/* <AnimatePresence>
                {isArrowClicked &&
                    <>
                        <motion.div
                            className={styles.deckDropContainer}
                            animate={{ right: '100px' }}
                            transition={{ duration: 0.3 }}
                            exit={{ right: '-100px' }}
                        >

                        </motion.div>
                    </>
                }
            </AnimatePresence> */}
        </>

    )
}