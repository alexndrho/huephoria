import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
} from 'firebase/firestore';
import { getUser } from './user';
import { auth, db, palettesCollectionRef } from '../config/firebase';
import IPalettePost, {
  IPalettePostEntry,
  IPalettePostLikeSubmit,
  IPalettePostSubmit,
} from '../types/IPalettePost';

// page limit
const POST_PER_ROW = 4;
const POST_PER_PAGE = POST_PER_ROW * 3;

const getPalettePost = async (id: string) => {
  const docRef = doc(db, 'palettes', id);

  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  if (!data) throw new Error('Document not found');

  const userData = await getUser(data.uid);
  if (!userData) throw new Error('User not found');

  return {
    ...(data as IPalettePostEntry),
    id: docSnap.id,
    author: userData?.username,
    likes: await getLikesCount(id),
    userLike: await didUserLike(id),
  } satisfies IPalettePost;
};

const getInitialPalettePosts = async () => {
  const q = query(
    palettesCollectionRef,
    orderBy('createdAt', 'desc'),
    limit(POST_PER_PAGE)
  );

  const querySnapshot = await getDocs(q);

  const palettePosts = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const userData = await getUser(doc.data().uid);
      if (!userData) throw new Error('User not found');

      return {
        ...(doc.data() as IPalettePostEntry),
        id: doc.id,
        author: userData.username,
        likes: await getLikesCount(doc.id),
        userLike: await didUserLike(doc.id),
      } satisfies IPalettePost;
    })
  );

  return palettePosts;
};

const getMorePalettePosts = async (lastPost: IPalettePost) => {
  const q = query(
    palettesCollectionRef,
    orderBy('createdAt', 'desc'),
    startAfter(lastPost.createdAt),
    limit(POST_PER_PAGE)
  );

  const querySnapshot = await getDocs(q);

  const palettePosts = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const userData = await getUser(doc.data().uid);
      if (!userData) throw new Error('User not found');

      return {
        ...(doc.data() as IPalettePostEntry),
        id: doc.id,
        author: userData.username,
        likes: await getLikesCount(doc.id),
        userLike: await didUserLike(doc.id),
      } satisfies IPalettePost;
    })
  );

  return palettePosts;
};

const submitPalettePost = async (
  values: Omit<IPalettePostSubmit, 'uid' | 'createdAt'>
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not found');

  const doc = await addDoc(palettesCollectionRef, {
    ...values,
    uid,
    createdAt: serverTimestamp(),
  } satisfies IPalettePostSubmit);

  return doc;
};

const likePalettePost = async (id: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not found');
  const likesCollectionRef = collection(palettesCollectionRef, id, 'likes');

  const docRef = doc(likesCollectionRef, uid);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    await deleteDoc(docRef);
    return;
  }

  await setDoc(
    docRef,
    {
      createdAt: serverTimestamp(),
    } satisfies IPalettePostLikeSubmit,
    {
      merge: true,
    }
  );
};

const didUserLike = async (id: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return false;
  const likesCollectionRef = collection(palettesCollectionRef, id, 'likes');

  const docRef = doc(likesCollectionRef, uid);
  const snapshot = await getDoc(docRef);

  return snapshot.exists();
};

const getLikesCount = async (id: string) => {
  const likesCollectionRef = collection(palettesCollectionRef, id, 'likes');
  const snapshot = await getCountFromServer(likesCollectionRef);

  return snapshot.data().count;
};

export {
  POST_PER_ROW,
  POST_PER_PAGE,
  getPalettePost,
  getInitialPalettePosts,
  getMorePalettePosts,
  submitPalettePost,
  likePalettePost,
  didUserLike,
  getLikesCount,
};
