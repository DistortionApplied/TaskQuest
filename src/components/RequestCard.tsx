import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface RequestCardProps {
  id: number;
  itemName: string;
  itemType: string;
  description?: string;
  completedTasks: number;
  totalTasks: number;
  isCompleted: boolean;
}

export function RequestCard({
  id,
  itemName,
  itemType,
  description,
  completedTasks,
  totalTasks,
  isCompleted,
}: RequestCardProps) {
  const router = useRouter();
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "cigarette":
        return "🚬";
      case "beer":
        return "🍺";
      case "computer_time":
        return "💻";
      default:
        return "🎁";
    }
  };

  const handleClick = () => {
    router.push(`/request/${id}`);
  };

  return (
    <Card onClick={handleClick} className="mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getItemIcon(itemType)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{itemName}</h3>
              {isCompleted && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Completed
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
            )}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tasks: {completedTasks}/{totalTasks}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
    </Card>
  );
}