import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import axios from 'axios'



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
        <h1 className={styles.h1}>Coming soon!</h1>
        <div className={styles.container}>
          <p className={styles.p}>You can sign up to be notified when we go live below.</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Email address"
            onChange={(e) => handleInput(e.target.value)}
          />
          <button className={styles.btn} onClick={() => handleSubmit(formData)}>
            Submit
          </button>
        </div>
      </main>
    </>
  )
}
