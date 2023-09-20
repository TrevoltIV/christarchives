import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { db, auth } from '@/firebaseConfig'
import { ref, getDownloadURL, listAll } from 'firebase/storage'
import { storage } from '@/firebaseConfig.js'
import { collection, query, getDocs, where, updateDoc, getDoc, doc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import addToFavorites from '@/functions/addToFavorites'
import addToPOTW from '@/functions/addToPOTW'
import reportPost from '@/functions/reportPost'
import deletePost from '@/functions/deletePost'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/post/postPage.module.css'

export default function UserPage({ postData }) {
    const [videoURL, setVideoURL] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [userData, setUserData] = useState(null)
    const [userStatus, setUserStatus] = useState('user')
    const [optionsMenu, setOptionsMenu] = useState(false)

    const router = useRouter()

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

    // Grab IP of user to log in DB
    useEffect(() => {

        const fetchIP = async () => {
        const res = await axios.get("https://api.ipify.org?format=json")
        if (res.status === 200 && loaded === false) {
            await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_POST' : 'USER_' + res.data.ip + '_POST'), {
                ip: res.data.ip,
                date: Date.now(),
                user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
                page: 'Post',
            })
            setLoaded(true)
        }
        }

        fetchIP()

        onAuthStateChanged(auth, (user) => {
            if (user) {
                getUserStatus(user)
            } else {
                setUserStatus('user')
            }
        })

        const getUserStatus = async (user) => {
            const q = query(collection(db, 'users'), where('email', '==', user.email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                setUserStatus(querySnapshot.docs[0].data().status)
                setUserData(querySnapshot.docs[0].data())
            }
        }
    }, [loaded])

    const handleAppeal = () => {
        alert('Email Karsten at kgk1999@gmail.com if you feel this review is in error.')
    }

    // Toggle options menu
    const handleOptionsMenu = () => {
        setOptionsMenu(!optionsMenu)
    }

    // Handle options button clicks
    const handleOptions = async (e) => {
        if (e.target.id === 'favorite') {
            // Add post to favorites
            addToFavorites(postData[0].date, userData?.username)
        } else if (e.target.id === 'potw') {
            // Add post to posts of the week list
            if (userStatus === 'admin') {
                addToPOTW(postData[0])
            } else {
                alert('Error: Admin status required.')
            }
        } else if (e.target.id === 'report') {
            // Report post
            reportPost(postData[0].date, userData)
        } else if (e.target.id === 'delete') {
            // Delete post
            deletePost(postData[0].date)
            .then(() => {
                router.push('/')
            })
        } else if (e.target.id === 'login') {
            // Redirect to login page
            router.push('/login')
        }
    }

    if (!postData[0].error) {
        // Status 200
        return (
            <main className={styles.main}>
                <Header />
                <div className={styles.container}>
                    {/* POST HEADER */}
                    <div className={styles.postHeader}>
                        <button onClick={handleOptionsMenu} className={styles.optionsMenuBtn}>
                            ...
                        </button>
                        {optionsMenu && (
                            <div className={styles.optionsMenu}>
                                {userData !== null && (
                                    <button id="favorite" onClick={(e) => handleOptions(e)} className={styles.optionBtn}>
                                        Add to Favorites
                                    </button>
                                )}
                                {userStatus === 'admin' && (
                                    <>
                                        <button id="potw" onClick={(e) => handleOptions(e)} className={styles.optionBtn}>
                                            Add to POTW
                                        </button>
                                        <button id="delete" onClick={(e) => handleOptions(e)} className={styles.optionBtn}>
                                            Delete
                                        </button>
                                    </>
                                )}
                                {userData !== null && (
                                    <button id="report" onClick={(e) => handleOptions(e)} className={styles.optionBtn}>
                                        Report
                                    </button>
                                )}
                                {userData === null && (
                                    <button id="login" onClick={(e) => handleOptions(e)} className={styles.optionBtn}>
                                        Login or Signup
                                    </button>
                                )}
                            </div>
                        )}
                        <h2 className={styles.postHeaderTitle}>
                            {postData[0].title.toUpperCase()}
                        </h2>
                        {postData[0].prstatus === 'pending' && (
                            <div className={styles.prBannerPending}>
                                <p className={styles.prBannerStatus}>
                                    Peer Review Status: Pending
                                </p>
                                {/* Review Post Button */}
                                {userStatus === 'pr' && (
                                    <Link href={`/pr/post/${postData[0].date}`} className={styles.prReviewPostBtn}>
                                        Review Post
                                    </Link>
                                )}
                                {userStatus === 'moderator' && (
                                    <Link href={`/pr/post/${postData[0].date}`} className={styles.prReviewPostBtn}>
                                        Review Post
                                    </Link>
                                )}
                                {userStatus === 'admin' && (
                                    <Link href={`/pr/post/${postData[0].date}`} className={styles.prReviewPostBtn}>
                                        Review Post
                                    </Link>
                                )}
                            </div>
                        )}
                        {postData[0].prstatus === 'approved' && (
                            <div className={styles.prBannerApproved}>
                                <p className={styles.prBannerStatus}>
                                    Peer Review Status: Approved
                                </p>
                                {postData[0].prnotes !== null && (
                                    <div className={styles.prBannerNotes}>
                                        <p className={styles.prBannerNotesTitle}>
                                            Notes:
                                        </p>
                                        <p className={styles.prBannerNotesText}>
                                            {postData[0].prnotes.body}
                                        </p>
                                        {postData[0].prnotes.links.map((item, index) => {
                                            return (
                                                <Link key={index} href={item} className={styles.sourceLink}>
                                                    Source {index + 1}
                                                </Link>
                                            )
                                        })}
                                        <p className={styles.date}>
                                            Date reviewed: {new Date(postData[0].prnotes.date).toLocaleDateString('en-US')}
                                        </p>
                                        <p className={styles.reviewer}>
                                            Reviewer: {postData[0].prnotes.reviewer}
                                        </p>
                                        <button className={styles.appealBtn} onClick={handleAppeal}>
                                            Challenge Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {postData[0].prstatus === 'partial' && (
                            <div className={styles.prBannerPartial}>
                                <p className={styles.prBannerStatus}>
                                    Peer Review Status: Partially Approved
                                </p>
                                {postData[0].prnotes !== null && (
                                    <div className={styles.prBannerNotes}>
                                        <p className={styles.prBannerNotesTitle}>
                                            Notes:
                                        </p>
                                        <p className={styles.prBannerNotesText}>
                                            {postData[0].prnotes.body}
                                        </p>
                                        {postData[0].prnotes.links.map((item, index) => {
                                            return (
                                                <Link key={index} href={item} className={styles.sourceLink}>
                                                    Source {index + 1}
                                                </Link>
                                            )
                                        })}
                                        <p className={styles.date}>
                                            Date reviewed: {new Date(postData[0].prnotes.date).toLocaleDateString('en-US')}
                                        </p>
                                        <p className={styles.reviewer}>
                                            Reviewer: {postData[0].prnotes.reviewer}
                                        </p>
                                        <button className={styles.appealBtn} onClick={handleAppeal}>
                                            Challenge Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {postData[0].prstatus === 'rejected' && (
                            <div className={styles.prBannerRejected}>
                                <p className={styles.prBannerStatus}>
                                    Peer Review Status: Rejected
                                </p>
                                {postData[0].prnotes !== null && (
                                    <div className={styles.prBannerNotes}>
                                        <p className={styles.prBannerNotesTitleRej}>
                                            Notes:
                                        </p>
                                        <p className={styles.prBannerNotesText}>
                                            {postData[0].prnotes.body}
                                        </p>
                                        {postData[0].prnotes.links.map((item, index) => {
                                            return (
                                                <Link key={index} href={item} className={styles.sourceLink}>
                                                    Source {index + 1}
                                                </Link>
                                            )
                                        })}
                                        <p className={styles.prBannerDate}>
                                            Date reviewed: {new Date(postData[0].prnotes.date).toLocaleDateString('en-US')}
                                        </p>
                                        <p className={styles.reviewer}>
                                            Reviewer: {postData[0].prnotes.reviewer}
                                        </p>
                                        <button className={styles.appealBtn} onClick={handleAppeal}>
                                            Challenge Review
                                        </button>
                                    </div>
                                )}
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
                    </div>
                </div>
            </main>
        )
    } else {
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