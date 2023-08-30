import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { auth, db } from '@/firebaseConfig'
import { setDoc, doc } from 'firebase/firestore'
import Header from '@/components/Header'
import styles from '@/styles/Upload.module.css'



export default function Upload() {
    const [formData, setFormData] = useState({
        name: null,
        title: null,
        body: null,
        category: null,
        link: null,
        pass: null,
    })


    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleUpload = async () => {
        if (formData.name !== null && formData.body !== null && formData.title !== null && formData.category !== null && formData.pass == 1390) {
            await setDoc(doc(db, 'uploads', Date.now().toString()), {
                name: formData.name,
                date: Date.now(),
                title: formData.title,
                body: formData.body,
                category: formData.category,
                link: formData.link,
            })
            .then(() => {
                alert('Success!')
            })
            .catch((error) => {
                alert(error)
            })
        } else {
            alert('Fill out all required fields and make sure you have the passcode to post.')
        }
    }



    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.upload}>
                <input className={styles.input} type="text" id="pass" onChange={(e) => handleInput(e)} placeholder="*Passcode" />
                <input className={styles.input} type="text" id="name" onChange={(e) => handleInput(e)} placeholder="*Name" />
                <input className={styles.input} type="text" id="title" onChange={(e) => handleInput(e)} placeholder="*Title" />
                <textarea className={styles.textarea} id="body" onChange={(e) => handleInput(e)} placeholder="*Body" />
                <input className={styles.input} type="text" id="category" onChange={(e) => handleInput(e)} placeholder="*Category" />
                <input className={styles.input} type="text" id="link" onChange={(e) => handleInput(e)} placeholder="Link URL (optional)" />
                <button className={styles.btn} onClick={handleUpload}>
                    Submit
                </button>
            </div>
        </main>
    )
}