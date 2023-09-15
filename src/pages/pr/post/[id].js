import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useSyncExternalStore } from 'react'
import { db, auth } from '@/firebaseConfig'
import { ref, getDownloadURL, listAll } from 'firebase/storage'
import { storage } from '@/firebaseConfig.js'
import { collection, query, getDocs, where, updateDoc, getDoc, doc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/pr/post/postPage.module.css'

export default function UserPage({ postData }) {
    const [videoURL, setVideoURL] = useState(null)
    const [valid, setValid] = useState(false)
    const [userData, setUserData] = useState(null)

    const router = useRouter()

    useEffect(() => {

        // Authenticate user
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserStatus(user)
            } else {
                router.push(`/post/${postData[0].date}`)
            }
        })

        // Fetch user privelege status and redirect if not PR
        const fetchUserStatus = async (user) => {
            setUserData(user)

            const q = query(collection(db, 'users'), where('email', '==', user.email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                if (querySnapshot.docs[0].data().status === 'pr' || querySnapshot.docs[0].data().status === 'moderator' || querySnapshot.docs[0].data().status === 'admin') {
                    setValid(true)
                } else {
                    setValid(false)
                    router.push('/')
                }
            }
        }

        // Redirect if post is not pending
        if (postData[0].prstatus !== 'pending') {
            router.push('/pr/dashboard')
        }

        // Get video if one exists
        const fetchVideo = async () => {
            if (postData[0].video === null) return

            const storageRef = ref(storage, `videos/${postData[0].video}`)
            const res = await listAll(storageRef)

            const urls = await Promise.all(
                res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef)
                    return {
                        url: url,
                        filename: itemRef.name,
                    }
                })
            )

            setVideoURL(urls[0])
        }

        fetchVideo()
    }, [postData, router])


    if (!postData[0].error && valid) {
        // Status 200
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    {/* POST HEADER */}
                    <div className={styles.postHeader}>
                        <p className={styles.prModeBanner}>
                            PEER REVIEW MODE
                        </p>
                        <h2 className={styles.postHeaderTitle}>
                            {postData[0].title.toUpperCase()}
                        </h2>
                        {postData[0].prstatus === 'pending' && (
                            <div className={styles.prBannerPending}>
                                <p className={styles.prBannerStatus}>
                                    Peer Review Status: Pending
                                </p>
                            </div>
                        )}
                    </div>
                    {/* POST */}
                    <div className={styles.post}>
                        <p className={styles.body}>
                            {postData[0].body}
                        </p>
                        {postData[0].link !== null && (
                            <Link href={postData[0].link}>
                                Source link
                            </Link>
                        )}
                        <p className={styles.category}>
                            Category: <Link className={styles.link} href={`/categories/${postData[0].category}`}>{postData[0].category}</Link>
                        </p>
                        <p className={styles.date}>
                            Date posted: {new Date(postData[0].date).toLocaleDateString('en-US')}
                        </p>
                        <p className={styles.author}>
                            Author: {postData[0].author}
                        </p>
                        <p className={styles.postID}>
                            Post ID: {postData[0].date}
                        </p>
                        {videoURL && (
                            <video className={styles.video} controls style={{ width: '300px', height: '168px' }}>
                                <source src={videoURL} />
                            </video>
                        )}
                        <Link href={`/pr/review/${postData[0].date}`} className={styles.reviewBtn}>
                            Review Post
                        </Link>
                    </div>
                </div>
            </main>
        )
    } else if (valid) {
        // Error message
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.postHeader}>
                        <h2 className={styles.postHeaderTitle}>
                            Error
                        </h2>
                    </div>
                    <p className={styles.errorText}>
                        Error: {postData[0].error}
                    </p>
                </div>
            </main>
        )
    }
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params

  try {
    const colRef = collection(db, 'uploads')
    const q = query(colRef, where('date', '==', parseInt(id)))
    const querySnapshot = await getDocs(q)
    let postDataArray = []

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        postDataArray.push(doc.data())
      })
    } else {
      postDataArray.push({ error: 'No post found.'})
    }

    return { props: { postData: postDataArray } }
  } catch (error) {
    console.error(`Error fetching post for id ${id}:`, error)
    return { notFound: true }
  }
}