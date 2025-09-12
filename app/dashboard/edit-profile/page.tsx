import { getProfile } from "@/app/actions/userActions"
import EditProfileForm from "./EditProfileForm"

export default async function EditProfilePage() {
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">User not found or unauthorized.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <EditProfileForm profile={profile} />
    </div>
  )
}
