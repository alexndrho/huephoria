import {
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, usersCollectionRef } from '../config/firebase';
import UserError from '../errors/UserError';
import IUser from '../types/IUser';

async function getUser(uid: string): Promise<IUser | null> {
  const docRef = doc(usersCollectionRef, uid);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return docSnap.data() as IUser;
}

function onUser(uid: string, callback: (user: IUser | null) => void) {
  const docRef = doc(usersCollectionRef, uid);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    callback(doc.data() as IUser);
  });

  return unsubscribe;
}

async function usernameExists(username: string): Promise<boolean> {
  let exists = false;

  const q = query(
    usersCollectionRef,
    where('username', '==', username),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc || !doc.exists()) return exists;
  exists = true;

  return exists;
}

async function createUpdateUsername(username: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not found');

  if (await usernameExists(username)) {
    throw new UserError('username-already-exists', 'Username already exists');
  }

  const docRef = doc(usersCollectionRef, uid);

  await setDoc(
    docRef,
    {
      username,
    },
    {
      merge: true,
    }
  );
}

export { getUser, onUser, usernameExists, createUpdateUsername };
