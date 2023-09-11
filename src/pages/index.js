import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/Home.module.css'



export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [formData, setFormData] = useState({
    email: null,
  })


  // Grab IP of user to log in DB
  useEffect(() => {

    const fetchIP = async () => {
      const res = await axios.get("https://api.ipify.org?format=json")
      if (res.status === 200 && loaded === false) {
        await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN' : res.data.ip), {
          ip: res.data.ip,
          date: Date.now(),
          user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
        })
        setLoaded(true)
      }
    }

    fetchIP()
  }, [])

  const handleInput = (val) => {
    setFormData({...formData, email: val})
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('/api/submit', formData)

      if (response.status === 200) {
        alert('Success! You will be notified when we go live!')
      }
    } catch(error) {
      alert(error)
    }
  }

  return (
    <>
      <Head>
        <title>Home | Christ Archives</title>
        <meta name="description" content="A forum and archive/peer review website for the evidence of Jesus Christ and more." />
        <meta name="tags" content="Evidence of Christ, bible, science, creation, christianity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>
            WELCOME TO CHRIST ARCHIVES!
          </h2>
          <p className={styles.welcomeText}>
            This is the first version of the site, many more updates are to come. If you are a web developer or want to become a member of the team, email me at kgk1999@gmail.com. You can join our Discord server <Link href="https://discord.gg/rRYwXmWk">here</Link>
          </p>
        </div>
        <div className={styles.about}>
          <div className={styles.aboutHeader}>
            <h2 className={styles.aboutHeaderTitle}>
              OUR MISSION
            </h2>
          </div>
          <p className={styles.aboutText}>
            I am making this website to offer a trustworthy central source of evidence for the Bible, prophecy, current events, and pretty much anything else related to the Bible and Christ.
            For now, the site is in early development so there may be bugs. This platform will allow individuals to conversate and post content that will then be peer reviewed by a trusted PR team.
            This will provide as accurate of a source of information as possible. This idea was inspired by all the confusion going on with people on TikTok spreading things that are not accurate,
            which makes people think all biblical evidence or conspiracy is fake. This is exactly how Satan wants it to be, so for anyone who seeks the truth, this is the site for you.
          </p>
        </div>
        <div className={styles.categoriesWrapper}>
          <div className={styles.categoriesHeader}>
            <h2 className={styles.categoriesHeaderTitle}>
              CATEGORIES
            </h2>
          </div>
          <div className={styles.categories}>
            <Link href="/categories/evolution" className={styles.categoryLink}>
              <p className={styles.category}>
                Evolution / Old Earth
              </p>
            </Link>
            <Link href="/categories/genesis" className={styles.categoryLink}>
              <p className={styles.category}>
                Genesis
              </p>
            </Link>
            <Link href="/categories/prophecy" className={styles.categoryLink}>
              <p className={styles.category}>
                Prophecy
              </p>
            </Link>
            <Link href="/categories/occult" className={styles.categoryLink}>
              <p className={styles.category}>
                Occult
              </p>
            </Link>
            <Link href="/categories/conspiracy" className={styles.categoryLink}>
              <p className={styles.category}>
                Conspiracy
              </p>
            </Link>
            <Link href="/categories/currentevents" className={styles.categoryLink}>
              <p className={styles.category}>
                Current Events
              </p>
            </Link>
            <Link href="/categories/aliens" className={styles.categoryLink}>
              <p className={styles.category}>
                &apos;Aliens&apos;
              </p>
            </Link>
            <Link href="/categories/catholicism" className={styles.categoryLink}>
              <p className={styles.category}>
                Catholicism
              </p>
            </Link>
            <Link href="/categories/misc" className={styles.categoryLink}>
              <p className={styles.category}>
                Misc
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
