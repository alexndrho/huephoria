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
  // likes: number;
}

export default IPalettePost;
export type { IPalettePostEntry, IPalettePostSubmit };
