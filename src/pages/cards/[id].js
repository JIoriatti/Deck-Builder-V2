
import styles from '../../styles/Card.module.css'
import { LazyLoadImage } from "react-lazy-load-image-component";
import Header from '@/components/Header';
import DynamicHeader from '@/components/DynamicHeader';
import Image from 'next/image';
import { useEffect } from 'react';
import crossmark from '../../../public/cross-mark-svgrepo-com.png'
import checkmark from '../../../public/checkmark-svgrepo-com.png'


const URL = "https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1";

export default function Card({ card, symbols }){
    const objectMapper = (object)=>{
        let list=[];
        for( const [key, value] of Object.entries(object)){
            list.push(`${key} : ${value}`)
            
        }
        return list;
    }

    return(
        <>  
            <div className={styles.mainContainer}>
            <Header />
            <DynamicHeader />
                <div className={styles.infoContainer}>
                    <div className={styles.imageContainer}>
                        <Image
                            className={styles.image}
                            src={card.image_uris.border_crop}
                            height={500}
                            width={365}
                            alt={card.name} 
                        />
                        {symbols.map((symbol)=>{
                            if(card.mana_cost.includes(`${symbol.symbol}`)){
                                return <Image
                                            className={styles.cardIcons} 
                                            src={symbol.svg_uri} 
                                            alt={symbol.english} 
                                            key={symbol.symbol}
                                            height={20}
                                            width={20} 
                                        />
                            }
                        })}
                    </div>
                    
                    <ul className={styles.legalitiesList}>
                        <h3>Legalities</h3>
                        <span className={styles.seperator}></span>
                        {objectMapper(card.legalities).map((legality)=>{
                            return <li
                                        key={legality}
                                        className={styles.legality}
                                    >
                                    {legality.charAt(0).toUpperCase() + legality.split(':')[0].slice(1)}
                                    {legality.includes(' : not_legal') ? 
                                    <Image
                                        src={crossmark}
                                        width={10}
                                        height={10}
                                        alt={'crossmark'}
                                    /> 
                                    : 
                                    <Image 
                                        src={checkmark}
                                        width={10}
                                        height={10}
                                        alt={'checkmark'}
                                    />}
                                </li>
                                    
                                    
                        })}
                    </ul>
                    <div className={styles.rightContainer}>
                        <h1 className={styles.cardName}>{card.name}</h1>
                        <h2 className={styles.setName}>{card.set_name}</h2>
                        <span className={styles.rarity}>{card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</span>
                        <span className={styles.type}>{card.type_line}</span>
                        <span className={styles.manaCost}>{card.mana_cost}</span>
                        <span className={styles.colorIdentity}>{card.colors}</span>
                        <p className={styles.cardDescription}>{card.oracle_text}</p>
                    </div>
                    
                </div>
                {/* <ul className={styles.symbolList}>
                {symbols.map((symbol)=> <Image 
                                            src={symbol.svg_uri} 
                                            alt={symbol.english} 
                                            key={symbol.symbol}
                                            height={20}
                                            width={20} />
                )}
                </ul> */}
            </div>

          
        </>
    )
}


// export async function getStaticPaths(){
//     const getAllCards = (url, nextPageUrl, prevResponse=[])=>{
//         return fetch(url)
//                 .then(response=> response.json())
//                 .then(newResponse=> {
//                     const response = [...prevResponse, ...newResponse.data];

//                     if(newResponse.next_page){
//                         nextPageUrl = newResponse.next_page
//                         return getAllCards(url, nextPageUrl, response);
//                     }
//                     return response;
//                 });
//     }
//     const cards = getAllCards(URL);
//     const paths = cards.data.map((card)=>{
//         return { 
//             params: {id: card.id}
//         }
//     })

//     return { paths, fallback:false}
// }
export async function getStaticPaths(){
    const response = await fetch(URL)
    const cards = await response.json();

    const paths = cards.data.map((card) => {
        return {
            params: { id: card.id }
        }
    })
    return { paths, fallback:false}
}

export async function getStaticProps({params}){
    const response = await fetch(`https://api.scryfall.com/cards/${params.id}`)
    const card = await response.json();
    const response2 = await fetch("https://api.scryfall.com/symbology")
    const symbolsData = await response2.json();
    const symbols = symbolsData.data ?? null;

    return { props: { card, symbols } }
}

    