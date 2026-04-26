import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const saveQuoteRequest = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "quotes"), {
      ...data,
      status: "new",
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getQuotes = async () => {
  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateQuoteStatus = async (id: string, status: string) => {
  const quoteRef = doc(db, "quotes", id);
  await updateDoc(quoteRef, { status });
};

// --- Products API ---

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return products;
};

export const saveProduct = async (data: any) => {
  const { id, ...rest } = data;
  if (id) {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { ...rest, updatedAt: serverTimestamp() });
    return id;
  } else {
    const docRef = await addDoc(collection(db, "products"), {
      ...rest,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};
