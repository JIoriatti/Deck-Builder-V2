
// ***** NOT IN USE, FOR FUTURE DEV ***** //


import { useEffect, useState } from 'react'
import styles from '../styles/PopUp.module.css'

export default function PopUp ({cardDetails, hovered}) {
    const [cardInfo, setcardInfo] = useState('');
    useEffect(()=>{
        setcardInfo(cardDetails);
    },[cardDetails])    

    return(
        <>
            {hovered && <div className={styles.popUp}>
                <div>Name: {cardInfo.name}</div>
                <div>Set-Name: {cardInfo.set_name}</div>
                <div>CMC: {cardInfo.cmc}</div>
            </div>}
        </>


    )
}