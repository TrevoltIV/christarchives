import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth, db } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/signup.module.css'








export default function Signup() {
    const [IP, setIP] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [formData, setFormData] = useState({
        username: null,
        email: null,
        password: null,
        confirmPassword: null,
        discord: null,
    })

    const router = useRouter()

    // Grab IP of user to log in DB
    useEffect(() => {

        const fetchIP = async () => {
            const res = await axios.get("https://api.ipify.org?format=json")
            if (res.status === 200 && loaded === false) {
                setIP(res.data.ip)
                await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_SIGNUP' : 'USER_' + res.data.ip + '_SIGNUP'), {
                    ip: res.data.ip,
                    date: Date.now(),
                    user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
                    page: 'Signup',
                })
                setLoaded(true)
            }
        }

        fetchIP()
    }, [loaded])

    // Log input values
    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }


    // Register user and add ref to database
    const handleSubmit = async () => {
        if (formData.username !== null && formData.email !== null && formData.password !== null) {
            if (formData.password === formData.confirmPassword) {
                const q = query(collection(db, 'users'), where('username', '==', formData.username))
                const querySnapshot = await getDocs(q)

                if (querySnapshot.docs.length > 0) {
                    alert('Username taken.')
                    return null
                } else {
                    createUserWithEmailAndPassword(auth, formData.email, formData.password)
                    .then(() => {
                        setDoc(doc(db, 'users', formData.email), {
                            username: formData.username,
                            email: formData.email,
                            dateJoined: Date.now(),
                            status: 'user',
                            discord: formData.discord,
                            ip: IP,
                        })
                        .then(() => {
                            router.push('/account/welcome')
                        })
                    })
                    .catch((error) => {
                        alert(error.message)
                    })
                }
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