import Link from 'next/link'
import Image from 'next/image'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebaseConfig'
import { useState, useEffect } from 'react'
import styles from '@/styles/components/Header.module.css'




export default function Header() {
  const [menu, setMenu] = useState(false)
  const [user, setUser] = useState(false)

  // Update user auth status
  useEffect(() => {
    onAuthStateChanged(auth, (uid) => {
      if (uid) {
        setUser(uid)
      } else {
        setUser(false)
      }
    })
  })

  const handleMenu = () => {
    setMenu(!menu)
  }

    return (
        <div className={styles.header}>
          <div className={styles.sideBar}></div>
          <Link href="/">
            <Image src="/Logo.png" alt="Logo" width="140" height="44" />
          </Link>
          <div className={styles.sideBar}>
            <div className={styles.menuBtn} onClick={handleMenu}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
          </div>
          {menu && (
            <div className={styles.menu}>
              <Link href="/" className={styles.menuLink}>
                Home
              </Link>
              {!user && (
                <>
                  <Link href="/login" className={styles.menuLink}>
                    Login
                  </Link>
                  <Link href="/signup" className={styles.menuLink}>
                    Signup
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/upload" className={styles.menuLink}>
                    Upload
                  </Link>
                </>
              )}
              <Link href="/jointheteam" className={styles.menuLink}>
                Join the team
              </Link>
              <Link href="/help" className={styles.menuLink}>
                Help
              </Link>
              <Link href="/donate" className={styles.menuLink}>
                Donate
              </Link>
              {user && (
                <>
                  <Link href="/account" className={styles.menuLink}>
                    Account
                  </Link>
                  <button onClick={() => auth.signOut()} className={styles.menuLink}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
    )
}