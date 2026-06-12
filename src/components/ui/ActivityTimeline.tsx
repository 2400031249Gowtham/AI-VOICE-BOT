// frontend/src/components/ui/ActivityTimeline.tsx
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

export default function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {idx !== activities.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/10" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center ring-8 ring-[#12121a]">
                    {activity.icon || <Activity className="h-4 w-4 text-purple-400" />}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-300">{activity.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-gray-500">
                    <time dateTime={activity.timestamp}>{new Date(activity.timestamp).toLocaleString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">No recent activity</div>
        )}
      </ul>
    </div>
  );
}
