
import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, webhookUrl, setWebhookUrl }) => {
  const [localUrl, setLocalUrl] = useState(webhookUrl);

  useEffect(() => {
    setLocalUrl(webhookUrl);
  }, [webhookUrl]);

  const handleSave = () => {
    setWebhookUrl(localUrl);
    onClose();
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity"
        onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Webhook URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="https://your-webhook-endpoint.com"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your messages will be sent to this URL via a POST request.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
