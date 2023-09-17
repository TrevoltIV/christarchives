import { db } from '@/firebaseConfig'
import { setDoc, doc } from 'firebase/firestore'




// Add post to posts-of-the-week list
export default async function addToPOTW(post) {
    if (typeof post !== 'object') return alert('Error: addToPOTW() params must include post object.')

    await setDoc(doc(db, 'postsoftheweek', post.date.toString()), {
        author: post.author,
        date: post.date,
        title: post.title,
    })
    .then(() => {
        return alert('Success!')
    })
    .catch((error) => {
        return alert(`Error: ${error.message}`)
    })
}