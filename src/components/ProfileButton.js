import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import styles from '../styles/ProfileButton.module.css'
import { useSession, signIn, signOut} from "next-auth/react";
import Link from "next/link";


export default function ProfileButton () {
    const {data: session, status} = useSession();
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const handleProfileClick = () =>{
        setIsProfileClicked(!isProfileClicked);
    }
    return (
        <>
            {status === 'authenticated' &&
                <div className={styles.profileWrapper}>
                    <button
                        className={styles.profileBtn}
                        onClick={handleProfileClick}
                    >
                        <Image
                            className={styles.profileImage}
                            src={session.user.image}
                            alt={session.user.name}
                            height={45}
                            width={45}
                        />
                    </button>
                    <AnimatePresence>
                        {isProfileClicked &&
                            <motion.div
                                className={styles.profileContainer}
                                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                                animate={{ opacity: 1, scaleY: 1, originY: 0 }}
                                transition={{ duration: 0.2 }}
                                exit={{ opacity: 0, scaleY: 0, originY: 0 }}
                            >
                                <AnimatePresence>
                                    <motion.span
                                        className={styles.profileName}
                                        key='profileName'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {session.user.name}
                                    </motion.span>
                                    <motion.span
                                        className={styles.seperator + ' ' + styles.removeMarg}
                                        key='seperator'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        exit={{ opacity: 0 }}
                                    >
                                    </motion.span>
                                    {/* <motion.span
                                        className={styles.profile}
                                        key='profile'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Profile
                                    </motion.span>
                                    <ul className={styles.navList} key='navList'>
                                        <li
                                            className={styles.listItem}>
                                                <Link
                                                    href="/profile/my-decks"
                                                    className={styles.listLink}>
                                                    My Decks
                                                </Link>
                                        </li>
                                    </ul> */}
                                    <motion.button
                                        className={styles.signOutBtn}
                                        onClick={() => signOut({ redirect: false })}
                                        key='signOutBtn'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Sign Out
                                    </motion.button>
                                </AnimatePresence>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            }
            {status === 'unauthenticated' &&
                <>
                    <button
                        className={styles.signInBtn}
                        onClick={() => signIn()}
                    >
                        Sign In
                    </button>
                </>
            }
        </>

    )
}