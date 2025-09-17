import classNames from 'classnames';
import React, { useState } from 'react';
import { Post } from '../types/Post';

type Props = {
  posts: Post[];
  setOpenSidebar: (value: string) => void;
  onSelectedComment: (value: number) => void;
  onSelectedPosts: (value: Post) => void;
};

export const PostsList: React.FC<Props> = ({
  posts,
  setOpenSidebar,
  onSelectedComment,
  onSelectedPosts,
}) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  function reset() {
    setSelectedPostId(null);
  }

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map(post => (
            <tr data-cy="Post" key={post.id}>
              <td data-cy="PostId">{post.id}</td>

              <td data-cy="PostTitle">{post.title}</td>

              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={classNames('button is-link', {
                    'is-light': selectedPostId !== post.id,
                  })}
                  onClick={e => {
                    const text = e.currentTarget.innerText;

                    setSelectedPostId(post.id);
                    onSelectedComment(post.id);
                    onSelectedPosts(post);

                    setOpenSidebar(text);

                    if (text === 'Close') {
                      reset();
                    }
                  }}
                >
                  {selectedPostId !== post.id ? 'Open' : 'Close'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PostsList.displayName = 'PostList';
