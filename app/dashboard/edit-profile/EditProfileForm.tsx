"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  firstname: string;
  lastname: string;
  email: string | null;
  username: string;
};

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();

  const [formData, setFormData] = useState<Profile>(profile);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState("");

  // Delete account modal
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully ✅");
        // Optionally revalidate or refresh
        router.refresh();
      } else {
        setMessage(json.error || "Failed to update profile");
      }
    } catch (err) {
      setMessage("Server error");
    }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwdMessage("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMessage("New password and confirm do not match");
      return;
    }
    setPwdLoading(true);
    setPwdMessage("");
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        setPwdMessage("Password updated ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwdMessage(json.error || "Failed to change password");
      }
    } catch (err) {
      setPwdMessage("Server error");
    }
    setPwdLoading(false);
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteMessage("Please enter your password");
      return;
    }
    setDeleteLoading(true);
    setDeleteMessage("");
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const json = await res.json();
      if (res.ok) {
        // successful delete — navigate to home
        router.push("/");
      } else {
        setDeleteMessage(json.error || "Failed to delete account");
      }
    } catch (err) {
      setDeleteMessage("Server error");
    }
    setDeleteLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Profile form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First name"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <div className="flex gap-2 justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
      </form>

      {/* Password change */}
      <form onSubmit={handleChangePassword} className="space-y-3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <div className="flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={pwdLoading}>
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
        {pwdMessage && <p className="text-sm text-yellow-600 dark:text-yellow-400">{pwdMessage}</p>}
      </form>

      {/* Delete account */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Permanently delete your account and all associated data.</p>

        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Account
        </button>

        {showDelete && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <p className="text-sm">Please confirm by entering your password:</p>
              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowDelete(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded" disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
              {deleteMessage && <p className="text-sm text-red-600">{deleteMessage}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
