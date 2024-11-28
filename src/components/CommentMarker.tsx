import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Comment } from '../types/comments';

interface CommentMarkerProps {
  comment: Comment;
  onReply: (commentId: string, text: string) => void;
  onResolve: (commentId: string) => void;
}

const CommentMarker: React.FC<CommentMarkerProps> = ({
  comment,
  onReply,
  onResolve,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${
          comment.resolved
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
        title={comment.resolved ? 'Resolved Comment' : 'Active Comment'}
      >
        <MessageCircle size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>
            {!comment.resolved && (
              <button
                onClick={() => onResolve(comment.id)}
                className="text-sm text-green-500 hover:text-green-600"
              >
                Resolve
              </button>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.text}</p>

          {comment.replies.length > 0 && (
            <div className="space-y-3 mb-4">
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {reply.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {reply.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!comment.resolved && (
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                           hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentMarker;
