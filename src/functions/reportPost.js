import { db } from '@/firebaseConfig'
import { collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore'




// Report post and send email
export default async function reportPost(post) {
    if (typeof post !== 'number') return alert('Error: reportPosts() params must include post id (date) as number.')

    return null
}