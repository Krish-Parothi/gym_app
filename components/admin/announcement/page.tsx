'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase, RgAnnouncement } from '@/lib/supabase';
import { Send, Trash2 } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<RgAnnouncement[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase.from('rg_announcements').select('*').order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setDataLoading(false);
  };

  const handlePost = async () => {
    if (!user || !title || !body) return;
    setPosting(true);
    await supabase.from('rg_announcements').insert({
      title,
      body,
      created_by: user.id,
    });
    setTitle('');
    setBody('');
    await loadAnnouncements();
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('rg_announcements').delete().eq('id', id);
    await loadAnnouncements();
  };

  if (loading || dataLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-black mb-6">Announcements</h1>

          <div className="bg-[#111111] rounded-2xl p-6 border border-white/10 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">Create Announcement</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF0000] mb-3"
            />
            <textarea
              placeholder="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF0000] mb-4 resize-none"
            />
            <button
              onClick={handlePost}
              disabled={posting || !title || !body}
              className="w-full py-3 bg-[#FF0000] text-white font-bold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} /> {posting ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-[#111111] rounded-2xl p-6 border border-white/10 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm">{ann.title}</h3>
                  <p className="text-[#aaa] text-xs mt-1">{ann.body}</p>
                  <p className="text-[#666] text-xs mt-2">{new Date(ann.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="p-2 hover:bg-[#FF0000]/20 rounded-lg transition-colors text-[#FF0000] flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
