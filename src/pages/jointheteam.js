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
                <br />
                <br />
                <br />
                <br />
                &nbsp;&nbsp;
                I am working on this page. You can join the <Link style={{color: '#fff'}} href="https://discord.gg/rRYwXmWk">discord server</Link> to apply for a team position &#40;Moderator, peer-reviewer, developer, promoter, etc.&#41;
            </div>
        </div>
    )
}