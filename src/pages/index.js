import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import axios from 'axios'
import Header from '@/components/Header'



export default function Home() {
  const [formData, setFormData] = useState({
    email: null,
  })



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
            This is the first version of the site, many more updates are to come. If you are a web developer or want to become a member of the team
            for any reason, contact me at: kgk1999@gmail.com
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
            For now, the site is in early development so it is more of a personal archive of mine for you to check out, but in the next updates I will add user accounts and the ability to post your
            own content which will then be peer reviewed by other knowledgeable people. This will provide as accurate of a source of information as possible. This idea was inspired by all the
            confusion going on with people on TikTok spreading things that are not accurate, which makes people think all biblical evidence or conspiracy is fake. This is exactly how Satan wants
            it to be, so for anyone who seeks the truth, this is the site for you.
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
