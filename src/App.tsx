import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { getUsers } from './Api/Users';
import { getPost } from './Api/Posts';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { Post } from './types/Post';
import { creatComments, deleteComment, getComments } from './Api/Comment';
import { Comment } from './types/Comment';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Post>();

  const [error, setError] = useState(false);
  const [errorComments, setErrorComments] = useState(false);

  const [selectedUser, setSelectedUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [openSidebar, setOpenSidebar] = useState('');

  const [comments, setComments] = useState<Comment[]>([]);

  async function fetchCreatComment({
    name,
    email,
    body,
    postId,
  }: Omit<Comment, 'id'>) {
    try {
      const result = await creatComments({ name, email, body, postId });

      setComments(currentComments => [...currentComments, result]);
    } catch {}
  }

  async function fetchPosts(userId: number) {
    setLoading(true);
    setError(false);

    if (userId !== selectedUserId) {
      setOpenSidebar('Close');
    }

    if (userId) {
      setSelectedUser(true);
    }

    try {
      const results = await getPost(userId);

      setPosts(results);
    } catch {
      setError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments(postId: number) {
    setLoadingComments(true);
    setErrorComments(false);

    try {
      const results = await getComments(postId);

      setComments(results);
    } catch {
      setLoadingComments(false);
      setErrorComments(true);
    } finally {
      setLoadingComments(false);
    }
  }

  async function fetchDeleteComment(id: number) {
    setComments(currentComment =>
      currentComment.filter(comment => comment.id !== id),
    );

    try {
      await deleteComment(id);
    } catch {}
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loadingUsers = await getUsers();

        setUsers(loadingUsers);
      } catch {}
    };

    fetchUsers();
  }, []);

  let content;

  if (!selectedUser) {
    content = <p data-cy="NoSelectedUser">No user selected</p>;
  } else if (loading) {
    content = <Loader />;
  } else if (posts.length > 0) {
    content = (
      <PostsList
        posts={posts}
        setOpenSidebar={setOpenSidebar}
        onSelectedComment={fetchComments}
        onSelectedPosts={setSelectedPosts}
      />
    );
  } else if (error) {
    content = (
      <div className="notification is-danger" data-cy="PostsLoadingError">
        Something went wrong!
      </div>
    );
  } else {
    content = (
      <div className="notification is-warning" data-cy="NoPostsYet">
        No posts yet
      </div>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  onSelect={fetchPosts}
                  selectedId={setSelectedUserId}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {content}
              </div>
            </div>
          </div>
          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': openSidebar === 'Open',
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {openSidebar === 'Open' && (
                <PostDetails
                  onDelete={fetchDeleteComment}
                  onSubmit={fetchCreatComment}
                  comments={comments}
                  selectedPost={selectedPosts}
                  isLoading={loadingComments}
                  erorrComments={errorComments}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
