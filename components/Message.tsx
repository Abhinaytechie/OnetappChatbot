
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white rounded-lg rounded-br-none'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-none';

  const Icon = isUser ? UserIcon : BotIcon;

  return (
    <div className={`${containerClasses} items-end space-x-2`}>
        {!isUser && <div className="flex-shrink-0"><Icon /></div>}
        <div className={`p-3 max-w-md md:max-w-lg ${bubbleClasses}`}>
            {isUser ? (
                <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
                <ReactMarkdown
                  className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-pre:my-2 prose-ul:my-2 prose-ol:my-2"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:underline" />
                  }}
                >
                  {message.text}
                </ReactMarkdown>
            )}
        </div>
        {isUser && <div className="flex-shrink-0"><Icon /></div>}
    </div>
  );
};