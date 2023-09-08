import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useSyncExternalStore } from 'react'
import { db, auth } from '@/firebaseConfig'
import { ref, getDownloadURL, listAll } from 'firebase/storage'
import { storage } from '@/firebaseConfig.js'
import { collection, query, getDocs, where, updateDoc, getDoc, doc } from 'firebase/firestore'
import Header from '@/components/Header'
import styles from '@/styles/post/postPage.module.css'

export default function UserPage({ postData }) {
    const [videoURL, setVideoURL] = useState(null)

    useEffect(() => {

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
    })

    if (!postData[0].error) {
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.postHeader}>
                        <h2 className={styles.postHeaderTitle}>
                            {postData[0].title.toUpperCase()}
                        </h2>
                    </div>
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
                        <p className={styles.author}>
                            Author: {postData[0].author}
                        </p>
                        {videoURL && (
                            <video className={styles.video} controls style={{ width: '300px', height: '168px' }}>
                                <source src={videoURL} />
                            </video>
                        )}
                    </div>
                </div>
            </main>
        )
    } else {
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
    const postDataArray = []

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