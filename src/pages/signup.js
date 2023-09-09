import Link from 'next/link'
import Header from '@/components/Header'
import { useState } from 'react'
import { auth, db } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import styles from '@/styles/signup.module.css'








export default function Signup() {
    const [formData, setFormData] = useState({
        username: null,
        email: null,
        password: null,
        confirmPassword: null,
        discord: null,
    })

    const router = useRouter()

    // Log input values
    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }


    // Register user and add ref to database
    const handleSubmit = async () => {
        if (formData.username !== null && formData.email !== null && formData.password !== null) {
            if (formData.password === formData.confirmPassword) {
                createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then(() => {
                    setDoc(doc(db, 'users', formData.email), {
                        username: formData.username,
                        email: formData.email,
                        dateJoined: Date.now(),
                        status: 'user',
                        discord: formData.discord,
                    })
                    .then(() => {
                        router.push('/account')
                    })
                })
                .catch((error) => {
                    alert(error.message)
                })
            } else {
                alert('Passwords do not match')
            }
        } else {
            alert('Please fill all fields')
        }
    }


    return (
        <div className={styles.container}>
            <Header />
            <div classname={styles.signup}>
                <h2 className={styles.title}>
                    REGISTER
                </h2>
                <div className={styles.form}>
                    <input
                        type="text"
                        id="username"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="*Username"
                    />
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="*Email address"
                    />
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="*Password"
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="*Confirm password"
                    />
                    <input
                        type="text"
                        id="discord"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="Discord username (optional)"
                    />
                    <p className={styles.switch}>
                        Already have an account? <Link href="/login" className={styles.link}>Login</Link>
                    </p>
                    <button onClick={handleSubmit} className={styles.btn}>
                        Signup
                    </button>
                </div>
            </div>
        </div>
    )
}