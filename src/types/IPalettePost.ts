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

export default IPalettePost;
