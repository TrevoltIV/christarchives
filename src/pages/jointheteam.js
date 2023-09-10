import Link from 'next/link'
import Header from '@/components/Header'
import styles from '@/styles/jointheteam.module.css'






export default function JoinTheTeam() {


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