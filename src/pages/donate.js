import { useState, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/donate.module.css'









export default function Donate() {
    const [loaded, setLoaded] = useState(false)


    // Grab IP of user to log in DB
    useEffect(() => {

        const fetchIP = async () => {
        const res = await axios.get("https://api.ipify.org?format=json")
        if (res.status === 200 && loaded === false) {
            await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_DONATE' : 'USER_' + res.data.ip + '_DONATE'), {
            ip: res.data.ip,
            date: Date.now(),
            user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
            page: 'Donate',
            })
            setLoaded(true)
        }
        }

        fetchIP()
    }, [loaded])



    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.donate}>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        Make A Donation
                    </h2>
                    <p className={styles.text}>
                        If you would like to donate via Bitcoin, you can send to the address below. Otherwise, please come back shortly after I have implemented payments.
                        All donations go to advertising or charity, no profits will be made whatsoever. Thanks!
                    </p>
                    <h3 className={styles.btcAddressTitle}>
                        &nbsp;BTC ADDRESS:
                    </h3>
                    <p className={styles.btcAddress}>
                        bc1q7gazhsrmxfmyjqj7hdfg6eemf8hy59fw2kzdyl
                    </p>
                </div>
            </div>
        </div>
    )
}