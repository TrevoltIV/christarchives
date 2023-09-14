import Link from 'next/link'
import { useState, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import axios from 'axios'
import Header from '@/components/Header'
import styles from '@/styles/jointheteam.module.css'






export default function JoinTheTeam() {
    const [loaded, setLoaded] = useState(false)


    // Grab IP of user to log in DB
  useEffect(() => {

    const fetchIP = async () => {
      const res = await axios.get("https://api.ipify.org?format=json")
      if (res.status === 200 && loaded === false) {
        await setDoc(doc(db, 'visitors', res.data.ip === '172.58.4.242' ? 'ADMIN_' + res.data.ip + '_JOINTHETEAM' : 'USER_' + res.data.ip + '_JOINTHETEAM'), {
          ip: res.data.ip,
          date: Date.now(),
          user: res.data.ip === '172.58.4.242' ? 'ADMIN' : 'Organic',
          page: 'Join the Team',
        })
        setLoaded(true)
      }
    }

    fetchIP()
  }, [loaded])


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.jointheteam}>
              <h2 className={styles.title}>
                JOIN THE TEAM
              </h2>
                <div className={styles.info}>
                  <p className={styles.text}>
                    If you are interested in volunteering as any of the following positions &#40;or others not listed&#41;, please join our <Link href="https://discord.gg/YCpEB2CQ" className={styles.link}>Discord server</Link>
                    &nbsp;or email at: <Link href="mailto:kgk1999@gmail.com" className={styles.link}>kgk1999@gmail.com</Link>.
                  </p>
                  <br />
                  <p className={styles.text}>
                    * Peer Reviewer<br />
                    * Moderator<br />
                    * Developer &#40;React, Next, Node&#41;<br />
                    * Designer &#40;Graphics, web design, etc.&#41;<br />
                    * Other skills potentially useful!
                  </p>
                </div>
            </div>
        </div>
    )
}