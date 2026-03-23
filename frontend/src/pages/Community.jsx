import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ArrowUpCircle, MessageCircle, Send } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const res = await axios.get('/api/community', config);
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
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/community', { title, content, tags: ['General'] }, config);
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
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/community/${id}/upvote`, {}, config);
      fetchPosts(); // Refresh upvotes
    } catch (err) {
      console.error(err);
    }
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
        <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-bold rounded-lg transition-colors">
          Ask a Question
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h2 className="font-bold mb-3 text-lg">Create a Post</h2>
          <form onSubmit={handlePost} className="space-y-3">
            <input required type="text" placeholder="Title of your question/post..." value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 font-bold" />
            <textarea required rows="4" placeholder="Share the details..." value={content} onChange={e=>setContent(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700"><Send size={16}/> Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow flex gap-4">
            <div className="flex flex-col items-center gap-1 min-w-[40px]">
              <button onClick={() => handleUpvote(post._id)} className="text-gray-400 hover:text-purple-600 transition-colors">
                <ArrowUpCircle size={28} />
              </button>
              <span className="font-bold text-gray-700">{post.upvotes}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{post.content}</p>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <span>By: {post.author ? post.author.name : 'Unknown User'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MessageCircle size={14}/> {post.comments.length} Comments</span>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-10 text-gray-500">No posts yet. Be the first to start a discussion!</div>
        )}
      </div>

    </div>
  );
}
