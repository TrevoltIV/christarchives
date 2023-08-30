import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { db, auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, getDocs, where, updateDoc, getDoc, doc } from 'firebase/firestore'
import Header from '@/components/Header'
import styles from '@/styles/post/postPage.module.css'
import { formToJSON } from 'axios'

export default function UserPage({ postData }) {

    if (!postData[0].error) {
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.postHeader}>
                        <h2 className={styles.postHeaderTitle}>
                            POST - {postData[0].title.toUpperCase()}
                        </h2>
                    </div>
                    <div className={styles.post}>
                        <p className={styles.body}>
                            {postData[0].body}
                        </p>
                        {postData[0].link !== null && (
                            <Link href={postData[0].link}>
                                {postData[0].link}
                            </Link>
                        )}
                        <p className={styles.category}>
                            Category: <Link className={styles.link} href={`/categories/${postData[0].category}`}>{postData[0].category}</Link>
                        </p>
                        <p className={styles.author}>
                            Author: {postData[0].author}
                        </p>
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
                            {postData[0].title.toUpperCase()}
                        </h2>
                    </div>
                    <p className={styles.errorText}>
                        An unknown error occurred. Please try again.
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
    const q = query(colRef, where('date', '==', id))
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