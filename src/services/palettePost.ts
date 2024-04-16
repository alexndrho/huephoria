import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
} from 'firebase/firestore';
import { getUsername } from './user';
import { auth, db, palettesCollectionRef } from '../config/firebase';
import IPalettePost, {
  IPalettePostEntry,
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

  const author = await getUsername(data.uid);

  return {
    ...(data as IPalettePostEntry),
    id: docSnap.id,
    author,
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
      const author = await getUsername(doc.data().uid);

      return {
        ...(doc.data() as IPalettePostEntry),
        id: doc.id,
        author,
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
      const author = await getUsername(doc.data().uid);

      return {
        ...(doc.data() as IPalettePostEntry),
        id: doc.id,
        author,
      } satisfies IPalettePost;
    })
  );

  return palettePosts;
};

const submitPalettePost = async (
  values: Omit<IPalettePost, 'id' | 'uid' | 'author' | 'createdAt'>
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

export {
  POST_PER_ROW,
  POST_PER_PAGE,
  getPalettePost,
  getInitialPalettePosts,
  getMorePalettePosts,
  submitPalettePost,
};
