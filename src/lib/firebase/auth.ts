import {
  GithubAuthProvider,
  NextOrObserver,
  User,
  onAuthStateChanged as _onAuthStateChanged,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function signInWithGitHub() {
  const provider = new GithubAuthProvider();

  provider.addScope("read:org");

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with GitHub", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with GitHub", error);
  }
}
