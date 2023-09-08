import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { db, auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, getDocs, where, updateDoc, getDoc, doc } from 'firebase/firestore'
import Header from '@/components/Header'
import styles from '@/styles/categories/categoryPage.module.css'
import { formToJSON } from 'axios'

export default function UserPage({ postData, category }) {

    if (!postData[0].error) {
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.categoryHeader}>
                        <h2 className={styles.categoryHeaderTitle}>
                            CATEGORY - {category.toUpperCase()}
                        </h2>
                    </div>
                    <div className={styles.posts}>
                        {postData.map((post, index) => {
                            if (post.prstatus === 'pending') {
                                return (
                                    <Link key={index} href={`/post/${post.date}`} className={styles.link}>
                                        <div className={styles.post}>
                                            <h2 className={styles.title}>
                                                {post.title}
                                            </h2>
                                            <div className={styles.authorWrapper}>
                                                <p className={styles.author}>
                                                    Author: {post.author}
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
                            } else if (post.prstatus === 'approved') {
                                return (
                                    <Link key={index} href={`/post/${post.date}`} className={styles.link}>
                                        <div className={styles.post}>
                                            <h2 className={styles.title}>
                                                {post.title}
                                            </h2>
                                            <div className={styles.authorWrapper}>
                                                <p className={styles.author}>
                                                    Author: {post.author}
                                                </p>
                                            </div>
                                            <div className={styles.prstatusApproved}>
                                                <p className={styles.prstatusText}>
                                                    Approved
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            } else if (post.prstatus === 'partial') {
                                return (
                                    <Link key={index} href={`/post/${post.date}`} className={styles.link}>
                                        <div className={styles.post}>
                                            <h2 className={styles.title}>
                                                {post.title}
                                            </h2>
                                            <div className={styles.authorWrapper}>
                                                <p className={styles.author}>
                                                    Author: {post.author}
                                                </p>
                                            </div>
                                            <div className={styles.prstatusPartial}>
                                                <p className={styles.prstatusText}>
                                                    Partially Approved
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            } else if (post.prstatus === 'rejected') {
                                return (
                                    <Link key={index} href={`/post/${post.date}`} className={styles.link}>
                                        <div className={styles.post}>
                                            <h2 className={styles.title}>
                                                {post.title}
                                            </h2>
                                            <div className={styles.authorWrapper}>
                                                <p className={styles.author}>
                                                    Author: {post.author}
                                                </p>
                                            </div>
                                            <div className={styles.prstatusRejected}>
                                                <p className={styles.prstatusText}>
                                                    Rejected
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                        })}
                    </div>
                </div>
            </main>
        )
    } else {
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.categoryHeader}>
                        <h2 className={styles.categoryHeaderTitle}>
                            CATEGORY - {category.toUpperCase()}
                        </h2>
                    </div>
                    <p className={styles.errorText}>
                        No posts found.
                    </p>
                </div>
            </main>
        )
    }
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params
  const category = id.toLowerCase()

  try {
    const colRef = collection(db, 'uploads')
    const q = query(colRef, where('category', '==', category))
    const querySnapshot = await getDocs(q)
    const postDataArray = []

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        postDataArray.push(doc.data())
      })
    } else {
      postDataArray.push({ error: 'No posts found.'})
    }

    return { props: { postData: postDataArray, category: category } }
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error)
    return { notFound: true }
  }
}