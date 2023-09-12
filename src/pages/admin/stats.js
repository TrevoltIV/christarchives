import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { query, where, getDocs, collection } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import Header from '@/components/Header'
import styles from '@/styles/admin/stats.module.css'







export default function Stats() {
    const [user, setUser] = useState(null)
    const [visitorsData, setVisitorsData] = useState([])

    const router = useRouter()


    useEffect(() => {
        onAuthStateChanged(auth, (userData) => {
            if (userData && userData.email === 'kgk1999@gmail.com') {
                setUser(true)
            } else {
                setUser(false)
                router.push('/')
            }
        })

        const fetchData = async () => {
            const q = query(collection(db, 'visitors'))
            const querySnapshot = await getDocs(q)
            let dataArray = []

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    dataArray.push(doc.data())
                })
                setVisitorsData(dataArray.sort((a, b) => {
                    return b.date - a.date
                }))
            }
        }

        fetchData()
    }, [router])


    if (user) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.stats}>
                    <h2 className={styles.title}>STATS</h2>
                    <div className={styles.visitors}>
                        <h3 className={styles.visitorsTitle}>
                            Recent Visits
                        </h3>
                        {visitorsData.map((visitor, index) => {
                            const date = new Date(visitor.date)
                            if (visitor.user !== 'ADMIN' && visitor.page === 'Home' && index < 40) {
                                return (
                                    <div key={index} className={styles.visitor}>
                                        <p className={styles.ip}>
                                            {visitor.ip}
                                        </p>
                                        <p className={styles.time}>
                                            {date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
                                        </p>
                                        <p className={styles.date}>
                                            {date.toLocaleDateString('en-US')}
                                        </p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        )
    }
}