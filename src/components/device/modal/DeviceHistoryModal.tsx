import React from 'react';
import { X, Calendar, Wrench, AlertTriangle, CheckCircle, RefreshCw, Settings, Activity } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

interface TimelineEvent {
  event_date: string;
  event_type: string;
  details: any;
  notes: string | null;
  performed_by_name: string;
}

interface DeviceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  timeline: TimelineEvent[];
  isLoading: boolean;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'purchase':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'maintenance':
      return <Settings className="h-5 w-5 text-yellow-500" />;
    case 'incident':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'software_update':
      return <RefreshCw className="h-5 w-5 text-green-500" />;
    case 'modification':
      return <Wrench className="h-5 w-5 text-purple-500" />;
    case 'condition_assessment':
      return <Activity className="h-5 w-5 text-indigo-500" />;
    default:
      return <CheckCircle className="h-5 w-5 text-gray-500" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'purchase':
      return 'bg-blue-50 border-blue-500';
    case 'maintenance':
      return 'bg-yellow-50 border-yellow-500';
    case 'incident':
      return 'bg-red-50 border-red-500';
    case 'software_update':
      return 'bg-green-50 border-green-500';
    case 'modification':
      return 'bg-purple-50 border-purple-500';
    case 'condition_assessment':
      return 'bg-indigo-50 border-indigo-500';
    default:
      return 'bg-gray-50 border-gray-500';
  }
};

export const DeviceHistoryModal: React.FC<DeviceHistoryModalProps> = ({
  isOpen,
  onClose,
  timeline,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Device History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No history found</h3>
              <p className="mt-1 text-sm text-gray-500">No events have been recorded for this device yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex items-center justify-center w-20 flex-shrink-0">
                      <div className={`absolute left-9 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${getEventColor(event.event_type)}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {getEventIcon(event.event_type)}
                        </div>
                      </div>
                    </div>
                    <div className={`flex-1 ml-4 p-4 rounded-lg ${getEventColor(event.event_type)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {event.event_type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {event.details && Object.entries(event.details).map(([key, value]) => (
                              <span key={key} className="block">
                                <span className="font-medium">{key.replace(/_/g, ' ')}</span>: {value}
                              </span>
                            ))}
                          </p>
                          {event.notes && (
                            <p className="mt-2 text-sm text-gray-500 italic">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDate(event.event_date)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            by {event.performed_by_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};