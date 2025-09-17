// import { Post } from '../types/Post';
// import { client } from '../utils/fetchClient';

// export const getPost = (userId: number) => {
//   return client.get<Post[]>(`/posts?userId=${userId}`);
// };

import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';

export const getComments = (id: number) => {
  return client.get<Comment[]>(`/comments?postId=${id}`);
};

export const creatComments = ({
  name,
  email,
  body,
  postId,
}: Omit<Comment, 'id'>) => {
  return client.post<Comment>('/comments', { name, email, body, postId });
};

export const deleteComment = (id: number) => {
  return client.delete(`/comments/${id}`);
};
