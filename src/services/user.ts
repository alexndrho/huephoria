import {
  addDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { usersCollectionRef } from '../config/firebase';
import UserError from '../errors/UserError';
import IUser from '../types/IUser';

async function getUsername(uid: string): Promise<string> {
  let username = '';

  const q = query(usersCollectionRef, where('uid', '==', uid), limit(1));

  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc || !doc.exists()) return username;

  const userData = doc.data() as IUser;

  if (userData.username) {
    username = userData.username;
  }

  return username;
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

async function uidExistsWithUsername(uid: string): Promise<boolean> {
  let exists = false;

  const q = query(usersCollectionRef, where('uid', '==', uid), limit(1));

  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc || !doc.exists()) return exists;

  const userData = doc.data() as IUser;

  if (userData.username) {
    exists = true;
  }

  return exists;
}

async function createUpdateUsername(
  uid: string,
  username: string
): Promise<void> {
  const q = query(usersCollectionRef, where('uid', '==', uid), limit(1));

  if (await usernameExists(username)) {
    throw new UserError('username-already-exists', 'Username already exists');
  }

  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc) {
    await addDoc(usersCollectionRef, {
      uid,
      username,
    } as IUser);

    return;
  }

  await updateDoc(doc.ref, {
    username,
  });
}

export {
  getUsername,
  usernameExists,
  uidExistsWithUsername,
  createUpdateUsername,
};
