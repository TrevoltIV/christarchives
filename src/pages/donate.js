import Header from '@/components/Header'
import styles from '@/styles/donate.module.css'









export default function Donate() {



    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.donate}>
                Donate page - under construction.

                <h2>
                    If you would like to donate via Bitcoin, you can send to the address below. Otherwise, please come back in a few days when I have implemented payments.
                    All donations go to either advertising or charity, no profits will be made whatsoever. Thanks!
                </h2>
                <br />
                <br />
                <h3>
                    &nbsp;BTC ADDRESS: &nbsp;bc1q7gazhsrmxfmyjqj7hdfg6eemf8hy59fw2kzdyl
                </h3>
            </div>
        </div>
    )
}