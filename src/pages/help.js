import Header from '@/components/Header'
import styles from '@/styles/help.module.css'






export default function Help() {



    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.help}>
                Visit the Discord server for support, this page is under construction.
            </div>
        </div>
    )
}