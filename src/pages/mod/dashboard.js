import Header from '@/components/Header'
import styles from '@/styles/mod/dashboard.module.css'





export default function Dashboard() {

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.dashboard}>
                Moderator Dashboard
            </div>
        </div>
    )
}