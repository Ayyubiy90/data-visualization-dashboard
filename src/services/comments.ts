import { Comment, CommentPosition } from '../types/comments';

const WS_URL = 'ws://localhost:8080';
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

type CommentCallback = (comments: Comment[]) => void;
type ConnectionCallback = (status: boolean) => void;

let onCommentsUpdate: CommentCallback = () => {};
let onConnectionChange: ConnectionCallback = () => {};

export const initializeComments = (
  commentsCallback: CommentCallback,
  connectionCallback: ConnectionCallback
) => {
  onCommentsUpdate = commentsCallback;
  onConnectionChange = connectionCallback;
  connectWebSocket();
};

const connectWebSocket = () => {
  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to comments WebSocket');
      onConnectionChange(true);
      reconnectAttempts = 0;
    };

    ws.onclose = () => {
      console.log('Disconnected from comments WebSocket');
      onConnectionChange(false);
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setTimeout(connectWebSocket, 2000 * reconnectAttempts);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'comments_update') {
          onCommentsUpdate(data.comments);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onConnectionChange(false); // Notify connection status change
        console.error('WebSocket error:', event);
    };
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
  }
};

export const addComment = (position: CommentPosition, text: string, author: string) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }

  ws.send(JSON.stringify({
    type: 'add_comment',
    data: {
      position,
      text,
      author,
      timestamp: new Date().toISOString(),
    },
  }));
};

export const addReply = (commentId: string, text: string, author: string) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }

  ws.send(JSON.stringify({
    type: 'add_reply',
    data: {
      commentId,
      text,
      author,
      timestamp: new Date().toISOString(),
    },
  }));
};

export const resolveComment = (commentId: string) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }

  ws.send(JSON.stringify({
    type: 'resolve_comment',
    data: {
      commentId,
    },
  }));
};

export const closeConnection = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};
