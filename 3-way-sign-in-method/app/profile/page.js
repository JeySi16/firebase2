"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || "");
      } else {
        // Redirect to sign in if not authenticated
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setMessage("");

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setUser(auth.currentUser);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.message || "Failed to update profile");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white dark:bg-[#0b0b0b] rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Sign In
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <span className="text-3xl text-zinc-400">
                      {(user.displayName?.[0] || user.email?.[0] || "?").toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {user.email}
                  {user.emailVerified && (
                    <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Name
                </label>
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter display name"
                    />
                    <button
                      type="submit"
                      className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setDisplayName(user.displayName || "");
                      }}
                      className="rounded bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {user.displayName || "No display name set"}
                    </span>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sign-in Provider
                </label>
                <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">
                  {user.providerData[0].providerId.replace(".com", "")}
                </div>
              </div>

              {message && (
                <div
                  className={`mt-4 p-2 text-sm rounded ${
                    message.includes("success")
                      ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
