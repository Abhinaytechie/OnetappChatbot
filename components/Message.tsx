
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

const IMAGE_REGEX = /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i;
const URL_REGEX = /^https?:\/\/[^\s$.?#].[^\s]*$/i;

const isImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.trim();
  return (
    URL_REGEX.test(cleanUrl) &&
    (IMAGE_REGEX.test(cleanUrl) || cleanUrl.toLowerCase().includes('quickchart.io/chart'))
  );
};

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white rounded-lg rounded-br-none'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-none border border-gray-200 dark:border-gray-700';

  const maxWidthClasses = isUser ? 'max-w-md md:max-w-lg' : 'max-w-md md:max-w-2xl lg:max-w-4xl';

  const Icon = isUser ? UserIcon : BotIcon;

  return (
    <div className={`${containerClasses} items-end space-x-2 w-full`}>
      {!isUser && <div className="flex-shrink-0 mb-1"><Icon /></div>}
      <div className={`p-4 ${maxWidthClasses} ${bubbleClasses} overflow-hidden break-words shadow-sm`}>
        {!isUser && isImageUrl(message.text.trim()) ? (
          <div className="flex flex-col">
            <img
              src={message.text.trim()}
              alt="Shared by bot"
              className="rounded-lg max-w-full h-auto border border-gray-300 dark:border-gray-600 shadow-md"
              loading="lazy"
            />
          </div>
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-pre:my-0 prose-ul:my-2 prose-ol:my-2 prose-headings:mb-1 prose-headings:mt-2"
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => {
                if (isImageUrl(props.href || '')) {
                  return (
                    <div className="my-3">
                      <img
                        src={props.href}
                        alt="Generated content"
                        className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-700 shadow-md"
                        loading="lazy"
                      />
                    </div>
                  );
                }
                return <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:underline break-all" />
              },
              img: ({ node, ...props }) => <img {...props} className="rounded-lg max-w-full h-auto my-2 border border-gray-300 dark:border-gray-600" />,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner bg-white/50 dark:bg-black/20">
                  <table {...props} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" />
                </div>
              ),
              th: ({ node, ...props }) => <th {...props} className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" />,
              td: ({ node, ...props }) => <td {...props} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800" />,
              pre: ({ node, ...props }) => {
                const content = String(props.children);
                // Check if the content is just a JSON containing an image URL or just the URL itself
                if (content.includes('http') && isImageUrl(content.match(/https?:\/\/[^\s"]+/)?.[0] || '')) {
                  return null;
                }
                return (
                  <div className="my-4 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-lg">
                    <div className="px-4 py-2 bg-gray-800/50 flex items-center justify-between border-b border-gray-800">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Output/Data</span>
                    </div>
                    <pre {...props} className="p-4 overflow-x-auto text-[13px] leading-relaxed text-blue-300 font-mono" />
                  </div>
                );
              }
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