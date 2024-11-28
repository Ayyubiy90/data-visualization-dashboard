import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Comment, CommentPosition } from '../types/comments';
import CommentMarker from './CommentMarker';

interface CommentOverlayProps {
  comments: Comment[];
  componentId: string;
  onAddComment: (position: CommentPosition, text: string) => void;
  onReplyToComment: (commentId: string, text: string) => void;
  onResolveComment: (commentId: string) => void;
}

const CommentOverlay: React.FC<CommentOverlayProps> = ({
  comments,
  componentId,
  onAddComment,
  onReplyToComment,
  onResolveComment,
}) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentPosition, setNewCommentPosition] = useState<CommentPosition | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingComment) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewCommentPosition({ x, y, componentId });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() && newCommentPosition) {
      onAddComment(newCommentPosition, newCommentText);
      setNewCommentText('');
      setNewCommentPosition(null);
      setIsAddingComment(false);
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 pointer-events-auto z-10">
        <button
          onClick={() => setIsAddingComment(!isAddingComment)}
          className={`p-2 rounded-full transition-colors ${
            isAddingComment
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
          title={isAddingComment ? 'Cancel adding comment' : 'Add comment'}
        >
          <Plus size={16} />
        </button>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${comment.x}%`,
            top: `${comment.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CommentMarker
            comment={comment}
            onReply={onReplyToComment}
            onResolve={onResolveComment}
          />
        </div>
      ))}

      {newCommentPosition && (
        <div
          className="absolute pointer-events-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80"
          style={{
            left: `${newCommentPosition.x}%`,
            top: `${newCommentPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setNewCommentPosition(null);
                  setNewCommentText('');
                  setIsAddingComment(false);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentOverlay;
