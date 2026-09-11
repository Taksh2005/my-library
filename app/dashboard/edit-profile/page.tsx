import { getProfile } from "@/app/actions/userActions"
import EditProfileForm from "./EditProfileForm"

export default async function EditProfilePage() {
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.5m0 3h.01M10.3 4.7 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Unable to load profile
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your profile could not be found or you are not authorized to view it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <svg
                className="h-5.5 w-5.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25c.45-3.1 2.85-5 7.5-5s7.05 1.9 7.5 5"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Manage your profile, password, and account
              </p>
            </div>
          </div>

          <div className="mt-5 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        <EditProfileForm profile={profile} />
      </div>
    </div>
  )
}