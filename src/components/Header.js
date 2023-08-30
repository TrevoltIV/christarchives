import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/components/Header.module.css'




export default function Header() {
    return (
        <div className={styles.header}>
          <div className={styles.sideBar}></div>
          <Link href="/">
            <Image src="/Logo.png" alt="Logo" width="140" height="44" />
          </Link>
          <div className={styles.sideBar}>
            {/* MENU BUTTON */}
          </div>
        </div>
    )
}