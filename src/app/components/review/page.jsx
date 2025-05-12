import { useState, useEffect } from 'react';

export default function ReviewSection({ requirementVersionId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?requirementVersionId=${requirementVersionId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          requirementVersionId,
          parentCommentId: replyTo,
          author: user.name,
        }),
      });
  
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter(comment => comment.parentCommentId === parentId)
      .map(comment => (
        <div key={comment.id} className="ml-4 border-l pl-4 my-2">
          <p><strong>{comment.author}</strong>: {comment.content}</p>
          <button
            onClick={() => setReplyTo(comment.id)}
            className="text-sm text-blue-600"
          >
            Reply
          </button>
          {renderComments(comments, comment.id)}
        </div>
      ));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      {renderComments(comments)}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className='flex flex-col'>
        <textarea
          className="w-50 border rounded p-2"
          placeholder={replyTo ? 'Reply...' : 'Add a comment...'}
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-50 "
        >
          {replyTo ? 'Reply' : 'Comment'}
        </button>
        {replyTo && (
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className="ml-2 text-gray-600"
          >
            Cancel Reply
          </button>
        )}
        </div>
      </form>
    </div>
  );
}
