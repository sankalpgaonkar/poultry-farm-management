import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Users, ArrowUpCircle, MessageCircle, Send, ChevronRight } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community', { title, content, tags: ['General'] });
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.put(`/community/${id}/upvote`, {});
      fetchPosts(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]) return;
    try {
      await api.post(`/community/${postId}/comments`, { content: commentText[postId] });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchPosts(); 
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Community Q&A</h1>
            <p className="text-sm text-gray-500">Ask questions, share advice, and help local farmers.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-bold rounded-lg transition-colors shadow-sm">
          Ask a Question
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-5 rounded-xl border shadow-lg animate-in fade-in zoom-in duration-200">
          <h2 className="font-bold mb-3 text-lg">Create a Post</h2>
          <form onSubmit={handlePost} className="space-y-3">
            <input required type="text" placeholder="Title of your question/post..." value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 font-bold" />
            <textarea required rows="4" placeholder="Share the details..." value={content} onChange={e=>setContent(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-all"><Send size={16}/> Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                <button onClick={() => handleUpvote(post._id)} className="text-gray-400 hover:text-purple-600 transition-colors">
                  <ArrowUpCircle size={28} />
                </button>
                <span className="font-bold text-gray-700">{post.upvotes}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3 whitespace-pre-line leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{post.author ? post.author.name : 'Unknown User'}</span>
                  <span>•</span>
                  <button onClick={() => toggleComments(post._id)} className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                    <MessageCircle size={14}/> {post.comments?.length || 0} Comments
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Thread Section */}
            {expandedPosts[post._id] && (
              <div className="mt-2 pl-14 space-y-4 pt-4 border-t border-dashed">
                <div className="space-y-3">
                  {post.comments?.map((comment, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-tight">{comment.author?.name || 'Anonymous'}</span>
                        <span className="text-[9px] text-gray-400">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-normal">{comment.content}</p>
                    </div>
                  ))}
                  {(!post.comments || post.comments.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No comments yet. Start the conversation!</p>
                  )}
                </div>

                {/* Add Comment Input */}
                <div className="flex gap-2 items-end">
                  <textarea 
                    placeholder="Write a comment..." 
                    value={commentText[post._id] || ''} 
                    onChange={e => setCommentText(prev => ({...prev, [post._id]: e.target.value}))}
                    className="flex-1 border text-xs p-2 rounded-lg bg-gray-50 focus:ring-1 focus:ring-purple-400 outline-none resize-none"
                    rows="1"
                  />
                  <button 
                    onClick={() => handleAddComment(post._id)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
            No posts yet. Be the first to start a discussion!
          </div>
        )}
      </div>

    </div>
  );
}
