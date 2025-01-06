import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAzureSyncStore } from '../../../stores/azureSyncStore';
import { formatDate } from '../../../utils/formatters';

export const SyncLogs: React.FC = () => {
  const { logs, isLoading, error, fetchLogs } = useAzureSyncStore();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-red-600">
          <p>Error loading sync logs: {error}</p>
          <button 
            onClick={() => fetchLogs()}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-900">Recent Synchronizations</h4>
        <button 
          onClick={() => fetchLogs()}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-4 rounded-lg border ${
              log.status === 'success' 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start">
              {log.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              )}
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    log.status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {log.status === 'success' 
                      ? `Successfully synchronized ${log.items_processed} ${log.type}`
                      : `Synchronization failed: ${log.error_message}`
                    }
                  </p>
                  <span className="text-xs text-gray-500">{formatDate(log.started_at)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {log.status === 'success' && (
                    <>
                      {log.items_created} created, {log.items_updated} updated, 
                      {log.items_failed} failed
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {logs.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No synchronization logs found
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm text-indigo-600 hover:text-indigo-900">
          View Full History
        </button>
      </div>
    </div>
  );
};