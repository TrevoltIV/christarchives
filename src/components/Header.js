import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from '@/styles/components/Header.module.css'




export default function Header() {
  const [menu, setMenu] = useState(false)

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
              <Link href="/login" className={styles.menuLink}>
                Login
              </Link>
              <Link href="/signup" className={styles.menuLink}>
                Signup
              </Link>
              <Link href="/jointheteam" className={styles.menuLink}>
                Join the team
              </Link>
              <Link href="/support" className={styles.menuLink}>
                Support
              </Link>
            </div>
          )}
        </div>
    )
}