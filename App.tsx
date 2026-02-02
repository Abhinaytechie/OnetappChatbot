
import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchFromWebhook } from './services/webhookService';
import { formatWebhookResponse } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import { SettingsIcon } from './components/icons/SettingsIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useLocalStorage<string>('one-tapp-webhook-url', '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        text: "Hello! I'm One Tapp. I can send your messages to a webhook and format the response. Please configure your webhook URL in the settings.",
        sender: 'bot',
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    if (!webhookUrl) {
      const botMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        text: "Error: Webhook URL is not set. Please click the gear icon to configure it.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const webhookResponse = await fetchFromWebhook(text, webhookUrl);
      const formattedText = await formatWebhookResponse(webhookResponse);

      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        text: formattedText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      const botMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        text: `Sorry, something went wrong: ${errorMessage}`,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl]);
  
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
       <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">One Tapp</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open settings"
        >
          <SettingsIcon />
        </button>
      </header>
      
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        error={error}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
      />
    </div>
  );
};

export default App;
