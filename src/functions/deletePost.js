import { db } from '@/firebaseConfig'
import { deleteDoc, doc } from 'firebase/firestore'




// Add post to user's favorites list
export default async function deletePost(post) {
    if (!post) return alert('Error: No post ID passed in deletePost() params.')

    await deleteDoc(doc(db, 'uploads', post.toString()))
    .then(() => {
        return alert('Post successfully deleted.')
    })
    .catch((error) => {
        return alert(error.message)
    })
}