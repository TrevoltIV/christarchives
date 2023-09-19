import { db } from '@/firebaseConfig'
import { setDoc, doc, collection, query, where, updateDoc, getDocs } from 'firebase/firestore'




// Report post and send email
export default async function reportPost(post, user) {

    await setDoc(doc(db, 'reports', Date.now().toString()), {
        post: post,
        date: Date.now(),
        reason: null,
        reporter: user.username,
        status: 'pending',
        reviewer: null,
    })
    .then(() => {
        return alert('Post has been reported successfully.')
    })
    .catch((error) => {
        return alert(`Error: ${error.message}`)
    })
}