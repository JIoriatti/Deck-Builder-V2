import styles from '../../styles/SignIn.module.css'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
export default function SignIn (){
    const [userInfo, setUserInfo] = useState({email: '', password: ''})
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const response = await signIn('credentials', {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        })
        console.log(response);
    }
    return (
        <>
            <div className={styles.signInForm}>
                
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <h1>Login</h1>
                    <input
                        className={styles.email}
                        type='email'
                        placeholder='email'
                        value={userInfo.email}
                        onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                    />
                    <input
                        className={styles.password}
                        type='password'
                        placeholder='password'
                        value={userInfo.password}
                        onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                    />
                    <input
                        className={styles.submit}
                        type='submit'
                        value='Login'
                    />
                </form>
            </div>
        </>
        
    )
}