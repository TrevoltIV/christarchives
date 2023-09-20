import { useState, useEffect } from 'react'
import generateResetCode from '@/functions/generateResetCode'
import { getDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/account/resetpassword.module.css'




export default function ResetPassword() {
    const [codeInput, setCodeInput] = useState(false)
    const [code, setCode] = useState(null)
    const [formData, setFormData] = useState({
        email: null,
        code: null,
    })


    useEffect(() => {
        const fetchCode = async () => {
            if (codeInput) {
                await getDoc(doc(db, 'resetcodes', formData.email))
                .then((doc) => {
                    setCode(doc.data().code)
                })
            }
        }

        fetchCode()
    }, [codeInput, formData.email])

    const handleInput = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async () => {
        if (formData.email !== null) {
            if (!codeInput) {
                // Send email and pop up code input
                await axios.post('/api/resetPasswordMailer', {code: await generateResetCode(formData.email), email: formData.email})
                .then(() => {
                    setCodeInput(true)
                })
            } else {
                if (code === formData.code) {
                    // Reset verified
                    alert('Verified.')
                } else {
                    alert('Incorrect code.')
                }
            }
        }
    }

    if (!codeInput) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.resetPassword}>
                    <h3 className={styles.title}>
                        Reset Password
                    </h3>
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="Email address"
                    />
                    <button onClick={handleSubmit} className={styles.btn}>
                        Reset
                    </button>
                </div>
            </div>
        )
    } else if (codeInput) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.resetPassword}>
                    <h3 className={styles.title}>
                        Enter the code we sent to your email.
                    </h3>
                    <input
                        type="number"
                        id="code"
                        onChange={(e) => handleInput(e)}
                        className={styles.input}
                        placeholder="4-digit code"
                    />
                    <button onClick={handleSubmit} className={styles.btn}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}