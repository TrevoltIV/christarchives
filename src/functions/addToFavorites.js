import { db } from '@/firebaseConfig'
import { collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore'




// Add post to user's favorites list
export default async function addToFavorites(post, user) {
    if (!post || !user) return alert('Error: addToFavorites() params must include post and user.')

    const q = query(collection(db, 'users'), where('username', '==', user))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data()

        if (!userData.favorites.includes(post)) {
            await updateDoc(doc(db, 'users', userData.email), {
                favorites: [...userData.favorites, post],
            })
            .then(() => {
                return alert('Success!')
            })
            .catch(() => {
                return alert('Error: Internal database error.')
            })
        } else {
            return alert('Error: Post already added.')
        }
    } else {
        return alert('Error: User not found.')
    }
}