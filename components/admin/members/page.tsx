'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase, RgUser } from '@/lib/supabase';
import { Search, Trash2 } from 'lucide-react';

export default function MembersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<RgUser[]>([]);
  const [search, setSearch] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('rg_users').select('*').neq('role', 'admin').order('created_at', { ascending: false });
      setMembers(data || []);
      setDataLoading(false);
    })();
  }, []);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || dataLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl font-black mb-6">Members</h1>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF0000]"
            />
          </div>

          <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[#888] font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-[#888] font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-[#888] font-semibold">Plan</th>
                  <th className="px-4 py-3 text-left text-[#888] font-semibold">Goal</th>
                  <th className="px-4 py-3 text-left text-[#888] font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-[#aaa] text-xs">{m.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        m.plan === 'Elite' ? 'bg-yellow-500/20 text-yellow-400' :
                        m.plan === 'Pro' ? 'bg-[#FF0000]/20 text-[#FF0000]' :
                        'bg-white/10 text-[#aaa]'
                      }`}>
                        {m.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#aaa]">{m.fitness_goal}</td>
                    <td className="px-4 py-3 text-[#aaa] text-xs">{new Date(m.join_date).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-[#888]">No members found</div>
            )}
          </div>

          <p className="text-[#888] text-xs mt-4">Total: {filtered.length} members</p>
        </div>
      </main>
    </div>
  );
}
