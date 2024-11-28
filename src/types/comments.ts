export interface Comment {
  id: string;
  componentId: string;
  text: string;
  author: string;
  timestamp: string;
  resolved: boolean;
  replies: Reply[];
  x: number;
  y: number;
}

export interface Reply {
  id: string;
  commentId: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface CommentPosition {
  x: number;
  y: number;
  componentId: string;
}
