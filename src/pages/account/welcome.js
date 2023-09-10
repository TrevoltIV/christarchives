import Header from '@/components/Header'
import styles from '@/styles/account/welcome.module.css'








export default function Welcome() {


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.welcome}>
                Welcome!
            </div>
        </div>
    )
}