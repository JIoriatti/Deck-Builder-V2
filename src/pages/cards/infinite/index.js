import CardsDisplay from "@/components/CardsDisplay";
import DynamicHeader from "@/components/DynamicHeader";
import Header from "@/components/Header";
import Head from "next/head";
import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import styles from '../../../styles/Cards.module.css'
import 'react-lazy-load-image-component/src/effects/blur.css';


export default function Infinite(){

    const fetchCards = async (page=1)=>{
        const response = await fetch(`https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1&page=${page}`)
        return response.json();
    } 
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchingPreviousPage } = useInfiniteQuery(
        'cards', 
    ({pageParam})=> fetchCards(pageParam),
    {
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return lastPage.has_more ? nextPage : undefined;
        }
    });
    
    useEffect(()=>{
        let fetching = false;
        const handleScroll = async (e) =>{
            const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;

            if(!fetching && scrollHeight - scrollTop <= (clientHeight * 2)){
                fetching = true;
                if(hasNextPage){
                    await fetchNextPage();
                }
                fetching = false;
            }
        }
        document.addEventListener('scroll', handleScroll);

        return ()=> document.removeEventListener('scroll', handleScroll);
    },[])

    return (
        <>
            <Head>
                <title>Deck Builder</title>
            </Head>
            <Header />
            <DynamicHeader />
            <div className={styles.mainContainer}>
                <div className={styles.cardsContainer}>
                    {data.pages.map((page, i)=>{
                        return <CardsDisplay key={i} page={page} />
                    })}
                </div>
            </div>
            
            
        </>
        
    )
}