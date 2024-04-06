import firebase from 'firebase/compat/app';

interface IPalettePost {
  id: string;
  uid: string;
  title: string;
  description: string;
  colors: string[];
  tags: string[];
  createdAt: firebase.firestore.Timestamp;
}

interface IPalettePostWithUsername extends IPalettePost {
  username: string;
}

export default IPalettePost;
export type { IPalettePostWithUsername };
