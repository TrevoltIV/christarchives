import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth, db } from '@/firebaseConfig'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import Header from '@/components/Header'
import styles from '@/styles/pr/dashboard.module.css'





export default function Dashboard() {
    const [userData, setUserData] = useState(null)
    const [valid, setValid] = useState(false)
    const [pendingPosts, setPendingPosts] = useState([])
    const [sortCategory, setSortCategory] = useState('all')

    const router = useRouter()


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserStatus(user)
            } else {
                router.push('/login')
            }
        })

        // Get user privelege status
        const fetchUserStatus = async (user) => {
            setUserData(user)

            const q = query(collection(db, 'users'), where('email', '==', user.email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                if (querySnapshot.docs[0].data().status === 'pr' || querySnapshot.docs[0].data().status === 'moderator' || querySnapshot.docs[0].data().status === 'admin') {
                    setValid(true)
                    fetchPendingPosts()
                } else {
                    setValid(false)
                    router.push('/')
                }
            }
        }

        // Get all posts pending for review
        const fetchPendingPosts = async () => {
            const q2 = query(collection(db, 'uploads'), where('prstatus', '==', 'pending'))
            const querySnapshot2 = await getDocs(q2)

            let postsArray = []
            if (!querySnapshot2.empty) {
                querySnapshot2.forEach((doc) => {
                    postsArray.push(doc.data())
                })
            } else {
                postsArray.push({ error: 'No pending posts found.' })
            }

            setPendingPosts(postsArray.sort((a, b) => {
                return a.date - b.date
            }))
        }
    }, [router])

    if (userData && valid) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.dashboard}>
                    <div className={styles.pendingPosts}>
                        <h2 className={styles.pendingPostsTitle}>
                            Pending Posts
                        </h2>
                        {pendingPosts.map((post, index) => {
                            if (post.error) {
                                // Error
                                return (
                                    <p key={index} className={styles.error}>
                                        Error: No pending posts found.
                                    </p>
                                )
                            } else {
                                // Pending posts
                                if (sortCategory === 'all') {
                                    return (
                                        <Link key={index} href={`/pr/post/${post.date}`} className={styles.link}>
                                            <div className={styles.post}>
                                                <h2 className={styles.title}>
                                                    {post.title}
                                                </h2>
                                                <div className={styles.authorWrapper}>
                                                    <p className={styles.author}>
                                                        Author: {post.author}
                                                    </p>
                                                </div>
                                                <div className={styles.categoryWrapper}>
                                                    <p className={styles.category}>
                                                        Category: {post.category}
                                                    </p>
                                                </div>
                                                <div className={styles.prstatusPending}>
                                                    <p className={styles.prstatusText}>
                                                        Pending Review
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                } else if (sortCategory === post.category) {
                                    return (
                                        <Link key={index} href={`/pr/post/${post.date}`} className={styles.link}>
                                            <div className={styles.post}>
                                                <h2 className={styles.title}>
                                                    {post.title}
                                                </h2>
                                                <div className={styles.authorWrapper}>
                                                    <p className={styles.author}>
                                                        Author: {post.author}
                                                    </p>
                                                </div>
                                                <div className={styles.categoryWrapper}>
                                                    <p className={styles.category}>
                                                        Category: {post.category}
                                                    </p>
                                                </div>
                                                <div className={styles.prstatusPending}>
                                                    <p className={styles.prstatusText}>
                                                        Pending Review
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                } else {
                                    return null
                                }
                            }
                        })}
                    </div>
                </div>
            </div>
        )
    }
}