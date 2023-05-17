import React from 'react';
import { color, motion } from "framer-motion"
import AnimationWrapper from "./AnimationWrapper"
import styles from '../styles/ColorFilter.module.css'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';

export default function ColorFilter (){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const colorArray = ['colorless', 'blue', 'black', 'green', 'red', 'white' , 'multicolored']
    
    return (

        <div
            className={styles.filterContainer}
        >
            {colorArray.map((color, index) => {
                let colorCapitilized = color.charAt(0).toUpperCase() + color.slice(1)
                return <div className={styles.colorContainer}key={index}>
                        <motion.input
                            type="checkbox"
                            id={color}
                            // key={index}
                            className={styles.colorCheckbox}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.label
                            className={styles.colorLabel}
                            htmlFor={color}
                            style={{ color: color }}
                            // key={'label' + color}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.05 }}
                        >{colorCapitilized}</motion.label>
                </div>
            })}
        </div>

    )
}