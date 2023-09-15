import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import { useState, useEffect } from 'react'
import styles from '@/styles/components/Header.module.css'




export default function Header() {
  const [menu, setMenu] = useState(false)
  const [user, setUser] = useState(false)
  const [userStatus, setUserStatus] = useState('user')

  const router = useRouter()

  // Update user auth status
  useEffect(() => {
    onAuthStateChanged(auth, (uid) => {
      if (uid) {
        setUser(uid)
        getUserStatus(uid)
      } else {
        setUser(false)
      }
    })

    // Fetch user's privelege status
    const getUserStatus = async (user) => {
      const q = query(collection(db, 'users'), where('email', '==', user.email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setUserStatus(querySnapshot.docs[0].data().status)
      } else {
        // Error fetching status: no user found
        setUserStatus('user')
      }
    }
  })

  // Toggle dropdown menu
  const handleMenu = () => {
    setMenu(!menu)
  }

  const handleLogout = () => {
    auth.signOut()
    setUserStatus('user')
    router.push('/login')
  }
  console.log(userStatus)

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
              {/* PR Dashboard */}
              {userStatus === 'pr' && (
                <Link href="/pr/dashboard" className={styles.menuLink}>
                  PR Dashboard
                </Link>
              )}
              {userStatus === 'moderator' && (
                <Link href="/pr/dashboard" className={styles.menuLink}>
                  PR Dashboard
                </Link>
              )}
              {userStatus === 'admin' && (
                <Link href="/pr/dashboard" className={styles.menuLink}>
                  PR Dashboard
                </Link>
              )}
              {/* Mod Dashboard */}
              {userStatus === 'moderator' && (
                <Link href="/mod/dashboard" className={styles.menuLink}>
                  Mod Dashboard
                </Link>
              )}
              {userStatus === 'admin' && (
                <Link href="/mod/dashboard" className={styles.menuLink}>
                  Mod Dashboard
                </Link>
              )}
              {user && (
                <>
                  <Link href="/account" className={styles.menuLink}>
                    Account
                  </Link>
                  <button onClick={handleLogout} className={styles.menuLink}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
    )
}