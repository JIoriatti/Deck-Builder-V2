import { useSession } from 'next-auth/react'

export default function Protected (){
    const session = useSession();
    console.log(session);
    return(
        <div>This page is Protected.</div>
    )
}