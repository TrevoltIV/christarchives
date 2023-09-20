import { db } from '@/firebaseConfig'
import { setDoc, doc } from 'firebase/firestore'












export default async function generateSecure4DigitCode(email) {
    const crypto = window.crypto || window.msCrypto
    
    if (!crypto) {
      console.error("Cryptographic API not available in this browser.")
      return null
    }
  
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)

    const code = String(array[0] % 10000).padStart(4, '0')

    await setDoc(doc(db, 'resetcodes', email), {
      code: code,
      email: email,
  })
  
    return code
  }