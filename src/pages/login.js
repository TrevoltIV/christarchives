import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import axios from 'axios'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Header from '@/components/Header'
import styles from '@/styles/login.module.css'








export default function Login() {
    const [loaded, setLoaded] = useState(false)
    const [formData, setFormData] = useState({
        email: null,
        password: null,
    })

    const router = useRouter()

    // Grab IP of user to log in DB
    useEffect(() => {

        const fetchIP = async () => {
        const res = await axios.get("https://api.ipify.org?format=json")
        if (res.status === 200 && loaded === false) {
            await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_LOGIN' : 'USER_' + res.data.ip + '_LOGIN'), {
            ip: res.data.ip,
            date: Date.now(),
            user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
            page: 'Login',
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

    // Log in
    const handleSubmit = () => {
        if (formData.email !== null && formData.password !== null) {
            signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then(() => {
                router.push('/')
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