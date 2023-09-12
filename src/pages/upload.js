import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth, db } from '@/firebaseConfig'
import { setDoc, doc, query, where, getDocs, collection } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { storage } from '@/firebaseConfig.js'
import { ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/upload.module.css'



export default function Upload() {
    const [loaded, setLoaded] = useState(false)
    const [user, setUser] = useState(false)
    const [userData, setUserData] = useState(null)
    const [formData, setFormData] = useState({
        title: null,
        body: null,
        category: null,
        link: null,
    })

    const router = useRouter()

    // Grab IP of user to log in DB
    useEffect(() => {

        const fetchIP = async () => {
        const res = await axios.get("https://api.ipify.org?format=json")
        if (res.status === 200 && loaded === false) {
            await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_UPLOAD' : 'USER_' + res.data.ip + '_UPLOAD'), {
            ip: res.data.ip,
            date: Date.now(),
            user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
            page: 'Upload',
            })
            setLoaded(true)
        }
        }

        fetchIP()
    }, [loaded])

    useEffect(() => {
        // Update auth state
        onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                setUser(userCredential)
                fetchUserData(userCredential)
            } else {
                router.push('/login')
            }
        })

        // Get user data from database
        const fetchUserData = async (userCredential) => {
            const q = query(collection(db, 'users'), where('email', '==', userCredential.email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    setUserData(doc.data())
                })
            } else {
                // Error code #1
                alert('Error: An authentication error has occurred. If this persists please contact Trevolt on Discord with error code #1')
                auth.signOut()
            }
        }
    }, [router])


    // Log input values
    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    // For video feature (later)
    const handleVideoInput = (e) => {
        setFormData({...formData, video: e.target.files[0]})
    }

    // Send email to Trevolt when post is uploaded
    const sendMail = async () => {
        try {
            await axios.post('/api/newUploadMailer', formData)
        } catch {
            return null
        }
    }

    // Upload post and redirect to it if successful
    const handleUpload = async () => {
        if (formData.body !== null && formData.title !== null && formData.category !== null) {
            const date = Date.now()

            await setDoc(doc(db, 'uploads', date.toString()), {
                author: userData.username,
                date: date,
                title: formData.title,
                body: formData.body,
                category: formData.category,
                link: formData.link,
                prstatus: 'pending',
                prnotes: null,
            })
            .then(() => {
                sendMail()
                router.push(`/post/${date}`)
            })
            .catch((error) => {
                alert(error.message)
            })
        } else {
            alert('Fill out all required fields.')
        }
    }



    if (user) {
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.upload}>
                    <h2>SUBMIT A POST</h2>
                    <input className={styles.input} type="text" id="title" onChange={(e) => handleInput(e)} placeholder="*Title" />
                    <textarea className={styles.textarea} id="body" onChange={(e) => handleInput(e)} placeholder="*Body" />
                    <input className={styles.input} type="text" id="category" onChange={(e) => handleInput(e)} placeholder="*Category" />
                    <input className={styles.input} type="text" id="link" onChange={(e) => handleInput(e)} placeholder="Link URL (optional)" />
                    <button className={styles.btn} onClick={handleUpload}>
                        Submit
                    </button>
                    Site is in beta. If problems occur, contact Trevolt on Discord.
                </div>
            </main>
        )
    }
}