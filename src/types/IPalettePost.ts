import firebase from 'firebase/compat/app';

interface IPalettePost {
  id: string;
  uid: string;
  title: string;
  author: string;
  description: string;
  isCreator: boolean;
  colors: string[];
  tags: string[];
  // likes: number;
  createdAt: firebase.firestore.Timestamp;
}

export default IPalettePost;
