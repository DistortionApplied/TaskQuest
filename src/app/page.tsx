import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center space-y-8">
        {/* App Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
            🎯
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TaskQuest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Gamified Task Management
          </p>
        </div>

        {/* App Description */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Turn your daily tasks into an adventure! Earn XP, level up, and unlock rewards by completing requests.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-500">⭐</span>
              <span>Earn XP</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-purple-500">⬆️</span>
              <span>Level Up</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-500">🎁</span>
              <span>Unlock Rewards</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-500">📋</span>
              <span>Track Progress</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Link
            href="/requests"
            className="block w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-lg transition-all"
          >
            Start Your Quest
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have requests?{" "}
            <Link href="/requests" className="text-blue-600 dark:text-blue-400 hover:underline">
              View them here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete tasks to earn XP and unlock your rewards
          </p>
        </div>
      </div>
    </div>
  );
}
