import firebase from 'firebase/compat/app';
import { FieldValue } from 'firebase/firestore';

interface IPalettePostEntry {
  uid: string;
  title: string;
  description: string;
  isCreator: boolean;
  colors: string[];
  tags: string[];
  createdAt: firebase.firestore.Timestamp;
}

interface IPalettePostSubmit extends Omit<IPalettePostEntry, 'createdAt'> {
  createdAt: FieldValue;
}

interface IPalettePost extends IPalettePostEntry {
  id: string;
  author: string;
  likes: number;
  userLike: boolean;
}

interface IPalettePostLikeEntry {
  uid: string;
  createdAt: firebase.firestore.Timestamp;
}

interface IPalettePostLikeSubmit
  extends Omit<IPalettePostLikeEntry, 'createdAt'> {
  createdAt: FieldValue;
}

export default IPalettePost;
export type {
  IPalettePostEntry,
  IPalettePostSubmit,
  IPalettePostLikeEntry,
  IPalettePostLikeSubmit,
};
