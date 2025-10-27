"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebase";


export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  async function handleGoogleSignIn() {
    setMessage("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setMessage(err.message || "Google sign-in failed");
    }
  }

  async function handleGithubSignIn() {
    setMessage("");
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      setMessage(err.message || "GitHub sign-in failed");
    }
  }

  async function handleSignUpWithEmail(e) {
    e.preventDefault();
    setMessage("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("test@gmail.com ");
      setPassword("12345678");
    } catch (err) {
      setMessage(err.message || "Sign up failed");
    }
  }

  async function handleSignInWithEmail(e) {
    e.preventDefault();
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("test@gmail.com");
      setPassword("12345678");
    } catch (err) {
      setMessage(err.message || "Sign in failed");
    }
  }

  async function handleSignOut() {
    setMessage("");
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setMessage(err.message || "Sign out failed");
    }
  }

  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-md rounded-md bg-white dark:bg-[#0b0b0b] p-8 shadow transform transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white animate-fade-in">Login</h2>

        {user ? (
          <div className="mb-4 text-center">
            <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-300">Signed in as</p>
            <p className="font-medium">{user.email || user.displayName}</p>
            <div className="mt-4 space-y-2">
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white w-full transition-colors duration-200"
                onClick={() => router.push("/profile")}
              >
                View Profile
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white w-full transition-colors duration-200"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4 animate-slide-up">
              <button
                className="w-full px-4 py-2 rounded bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleGoogleSignIn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </button>
              <button
                className="w-full px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleGithubSignIn}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <form className="flex flex-col gap-2 animate-slide-up" onSubmit={handleSignInWithEmail}>
              <input
                className="border px-3 py-2 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="border px-3 py-2 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex gap-2 mt-2">
                <button 
                  className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors duration-200" 
                  type="submit"
                >
                  Sign in
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
                  type="button"
                  onClick={handleSignUpWithEmail}
                >
                  Create account
                </button>
              </div>
            </form>
          </>
        )}

        {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}

        <p className="mt-6 text-xs text-center text-zinc-500">© 2025 baculi-auth-Project. All rights reserved.</p>
      </div>
    </div>
  );
}
