import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebaseConfig'
import Header from '@/components/Header'
import styles from '@/styles/login.module.css'








export default function Login() {
    const [formData, setFormData] = useState({
        email: null,
        password: null,
    })

    const router = useRouter()

    // Log input values
    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    // Log in
    const handleSubmit = () => {
        if (formData.email !== null && formData.password !== null) {
            signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then(() => {
                router.push('/account')
            })
            .catch((error) => {
                alert(error.message)
            })
        } else {
            alert('Please fill all fields')
        }
    }


    return (
        <div className={styles.container}>
            <Header />
            <div classname={styles.login}>
                <h2 className={styles.title}>
                    LOGIN
                </h2>
                <div className={styles.form}>
                    <input type="text" id="email" onChange={(e) => handleInput(e)} className={styles.input} placeholder="Email address" />
                    <input type="password" id="password" onChange={(e) => handleInput(e)} className={styles.input} placeholder="Password" />
                    <p className={styles.switch}>
                        Not a member yet? <Link href="/signup" className={styles.link}>Signup</Link>
                    </p>
                    <p className={styles.switch}>
                        <Link href="/account/resetpassword" className={styles.link}>Forgot password?</Link>
                    </p>
                    <button onClick={handleSubmit} className={styles.btn}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}