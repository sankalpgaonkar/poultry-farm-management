import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Users, 
  ArrowUpCircle, 
  MessageCircle, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity,
  Zap,
  Globe,
  X
} from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/community');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-16 pb-20">
      
      {/* Friendly Header Layer */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-2xl text-slate-900">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              <span className="text-sm font-black uppercase tracking-wider text-slate-500">Farmer Community</span>
           </div>
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-none">
              The <span className="text-purple-600">Community.</span>
           </h1>
           <p className="text-slate-400 font-medium text-lg leading-relaxed">
             Talk to other farmers, share tips, and grow together. Ask questions and help your neighbors succeed in poultry farming.
           </p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="h-20 px-10 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-wider hover:bg-purple-600 hover:-translate-y-1 transition-all duration-500 shadow-3xl shadow-slate-200 flex items-center justify-center gap-4 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          Start Discussion
        </button>
      </div>

      <div className="grid xl:grid-cols-12 gap-12">
        
        {/* Navigation & Controls - Sidebar Left */}
        <div className="xl:col-span-3 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-100/50 space-y-8">
              <div className="space-y-4">
                 <label className="text-sm font-black uppercase text-slate-400 tracking-wider italic px-2">Search Posts</label>
                 <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" placeholder="Look for help..." className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none font-black text-sm uppercase tracking-wider transition-all" />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-black uppercase text-slate-400 tracking-wider italic px-2">Topics</label>
                 <div className="flex flex-col gap-2">
                    {['General Help', 'Health & Safety', 'Market Prices', 'Buy/Sell Supplies'].map(channel => (
                       <button key={channel} className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-black uppercase tracking-wider text-slate-500 hover:text-purple-600 transition-all group">
                          {channel} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-purple-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-white/20 transition-colors"></div>
              <Activity size={32} className="text-purple-300 mb-6" />
              <h4 className="text-lg font-black uppercase tracking-tight leading-none mb-2">Active Area</h4>
              <p className="text-sm font-bold text-purple-200 uppercase tracking-wider leading-relaxed">Community is very active. Join the talk!</p>
           </div>
        </div>

        {/* Post Feed - Main Center Column */}
        <div className="xl:col-span-9 space-y-10">
          
          {/* Post Creation Modal */}
          {showForm && (
            <div className="bg-white border-2 border-purple-100 rounded-[2.5rem] p-8 md:p-10 shadow-3xl shadow-purple-100 animate-in slide-in-from-top-10 duration-500 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-purple-600" />
              <div className="flex justify-between items-center mb-10">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">New <span className="text-purple-600">Post.</span></h2>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Share your thoughts with everyone</p>
                 </div>
                 <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handlePost} className="space-y-8 text-slate-900">
                <div className="space-y-3">
                   <label className="text-sm font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Topic Title</label>
                   <input required type="text" placeholder="Title of your question/post..." value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[2rem] outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 font-black text-xs uppercase tracking-wider transition-all" />
                </div>
                <div className="space-y-3">
                   <label className="text-sm font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Details</label>
                   <textarea required rows="6" placeholder="Share more details about your topic..." value={content} onChange={e=>setContent(e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-8 py-6 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 resize-none font-medium text-slate-600 transition-all font-sans" />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="h-16 px-12 bg-slate-950 text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center gap-4 hover:bg-purple-600 transition-all shadow-xl shadow-purple-100">
                    <Send size={18}/> Post Now
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-8">
            {posts.map(post => (
              <div key={post._id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-700 flex flex-col md:flex-row gap-10 overflow-hidden text-slate-900">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-purple-50 transition-colors duration-700"></div>
                
                {/* Vote Area */}
                <div className="flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-[2rem] p-6 min-w-[100px] border border-slate-100 group-hover:bg-white group-hover:border-purple-100 transition-all duration-500">
                  <button 
                    onClick={() => handleUpvote(post._id)} 
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-purple-100 group-hover:shadow-purple-100/50"
                  >
                    <ArrowUpCircle size={32} strokeWidth={1.5} />
                  </button>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{post.upvotes}</span>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Agree</span>
                </div>

                <div className="flex-1 space-y-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-black uppercase tracking-wider border border-purple-100">General</span>
                       <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                       <span className="text-xs font-black text-slate-300 uppercase tracking-wider italic">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-purple-600 transition-colors leading-tight">{post.title}</h3>
                  </div>
                  
                  <p className="text-base text-slate-500 font-medium leading-relaxed whitespace-pre-line line-clamp-3 group-hover:line-clamp-none transition-all duration-700 font-sans">{post.content}</p>
                  
                  <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                          <Users size={20} className="text-white" />
                       </div>
                       <div className="space-y-1">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic leading-none block">Posted By</span>
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{post.author ? post.author.name : 'Unknown Farmer'}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <button className="flex items-center gap-3 text-sm font-black uppercase tracking-wider text-slate-400 hover:text-purple-600 transition-colors group/comments">
                          <MessageCircle size={18} className="group-hover/comments:scale-110 transition-transform" /> 
                          {post.comments.length} Comments
                       </button>
                       <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                          <ChevronRight size={20} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && !loading && (
              <div className="bg-slate-50/50 rounded-[4rem] p-32 text-center border-4 border-dashed border-slate-100 flex flex-col items-center gap-8">
                 <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-xl">
                    <Globe size={48} className="animate-spin-slow opacity-30" />
                 </div>
                 <div className="space-y-2 text-slate-900">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Posts Yet</h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Be the first to start a discussion in our community!</p>
                 </div>
                 <button onClick={() => setShowForm(true)} className="px-10 py-5 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-wider hover:bg-purple-600 transition-all">Start Posting</button>
              </div>
            )}
            
            {loading && (
              <div className="space-y-8 animate-pulse italic text-slate-300 text-center py-20 font-black uppercase tracking-[0.5em] text-xs">
                 Loading community...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
