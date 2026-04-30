interface XPBarProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
}

export function XPBar({ currentXP, level, xpForNextLevel }: XPBarProps) {
  const xpInLevel = currentXP - ((level - 1) * 100); // Assuming 100 XP per level
  const progressPercentage = (xpInLevel / 100) * 100;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Level {level}</span>
        <span className="text-sm text-gray-500">{xpInLevel}/100 XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-center mt-2">
        <span className="text-lg font-bold text-gray-900">{currentXP} Total XP</span>
      </div>
    </div>
  );
}