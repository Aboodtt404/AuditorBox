import React from 'react';
import { Clock, FileEdit, Upload, Plus, CheckCircle, MessageSquare } from 'lucide-react';

type ActivityAction = 'form_updated' | 'tb_imported' | 'aje_created' | 'form_signed' | 'comment_added';

interface Activity {
  id: string;
  action: ActivityAction;
  description: string;
  formId?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  onSelectForm?: (formId: string) => void;
}

const getActionIcon = (action: ActivityAction) => {
  switch (action) {
    case 'form_updated':
      return FileEdit;
    case 'tb_imported':
      return Upload;
    case 'aje_created':
      return Plus;
    case 'form_signed':
      return CheckCircle;
    case 'comment_added':
      return MessageSquare;
    default:
      return Clock;
  }
};

const getActionColor = (action: ActivityAction) => {
  switch (action) {
    case 'form_updated':
      return 'text-blue-400';
    case 'tb_imported':
      return 'text-green-400';
    case 'aje_created':
      return 'text-amber-400';
    case 'form_signed':
      return 'text-emerald-400';
    case 'comment_added':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  onSelectForm 
}) => {
  const MAX_VISIBLE = 10;
  const visibleActivities = activities.slice(0, MAX_VISIBLE);

  const handleFormClick = (formId: string) => {
    if (onSelectForm) {
      onSelectForm(formId);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="text-gray-400 text-center py-4">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-4">
          {visibleActivities.map((activity) => {
            const Icon = getActionIcon(activity.action);
            const colorClass = getActionColor(activity.action);
            const relativeTime = formatRelativeTime(activity.timestamp);
            
            return (
              <div 
                key={activity.id} 
                className="flex gap-3 group cursor-pointer"
                onClick={() => activity.formId && onSelectForm ? handleFormClick(activity.formId) : undefined}
              >
                <div className="flex-shrink-0 mt-1">
                  <Icon className={`w-5 h-5 ${colorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-sm truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.formId && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                        Form #{activity.formId}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {relativeTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
