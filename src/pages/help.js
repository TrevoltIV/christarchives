import Header from '@/components/Header'
import styles from '@/styles/help.module.css'






export default function Help() {



    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.help}>
                Help
            </div>
        </div>
    )
}