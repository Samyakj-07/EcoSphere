import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const config = {};
envStr.split('\n').forEach(line => {
  const match = line.match(/(VITE_FIREBASE_[A-Z_]+)="([^"]+)"/);
  if (match) config[match[1]] = match[2];
});

const firebaseConfig = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.VITE_FIREBASE_APP_ID
};

console.log("Testing connection to project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const docRef = doc(db, "users", "default_user");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    process.exit(0);
  } catch (err) {
    console.error("Firestore Error:", err);
    process.exit(1);
  }
}
run();
