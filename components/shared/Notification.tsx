import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { XMarkIcon, ShieldCheckIcon, UsersIcon } from '../icons/Icons'; // Assuming you have an ExclamationTriangleIcon for errors

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <ShieldCheckIcon className="w-6 h-6 text-green-500" />;
      case 'error':
         return <UsersIcon className="w-6 h-6 text-red-500" />; // Replace with a more appropriate error icon if you have one
      default:
        return null;
    }
  };
  
  const getBorderColor = (type: string) => {
     switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
         return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  }

  return (
    <div className="fixed top-24 right-4 z-50 w-full max-w-sm">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`relative flex items-start p-4 bg-white border-l-4 ${getBorderColor(notification.type)} rounded-r-lg shadow-lg animate-fade-in-right`}
            role="alert"
          >
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
       <style>{`
        @keyframes fade-in-right {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.5s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default Notification;