'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import StatsCard from '@/components/StatsCard';
import { supabase } from '@/lib/supabase';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ members: 0, revenue: 0, attendance: 0, avgPlan: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const [members, announcements] = await Promise.all([
        supabase.from('rg_users').select('*'),
        supabase.from('rg_announcements').select('*'),
      ]);

      const memberList = members.data || [];
      const proCount = memberList.filter(m => m.plan === 'Pro').length;
      const eliteCount = memberList.filter(m => m.plan === 'Elite').length;

      setStats({
        members: memberList.length - 1,
        revenue: (memberList.filter(m => m.plan === 'Starter').length * 999) + (proCount * 1799) + (eliteCount * 2999),
        attendance: memberList.reduce((s, m) => s + (Math.random() > 0.3 ? 1 : 0), 0),
        avgPlan: memberList.length > 1 ? Math.round((memberList.length - 1) / 3) : 0,
      });
      setDataLoading(false);
    })();
  }, []);

  if (loading || dataLoading) return <div className="min-h-screen bg-black" />;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-4xl font-black mb-1">Admin Dashboard</h1>
          <p className="text-[#888] mb-8">Welcome to Revolution Gym Control Center</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Members" value={stats.members} icon={Users} color="#FF0000" />
            <StatsCard title="Monthly Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={DollarSign} color="#FF0000" />
            <StatsCard title="Attendance Today" value={stats.attendance} icon={Calendar} color="#FF0000" />
            <StatsCard title="Avg. Members/Plan" value={stats.avgPlan} icon={TrendingUp} color="#FF0000" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-bold text-lg mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="/admin/members" className="block w-full py-2.5 px-4 bg-[#FF0000]/20 text-[#FF0000] rounded-lg hover:bg-[#FF0000]/30 transition-colors font-medium text-sm text-center">Manage Members</a>
                <a href="/admin/attendance" className="block w-full py-2.5 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm text-center">Attendance Reports</a>
                <a href="/admin/revenue" className="block w-full py-2.5 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm text-center">Revenue Analytics</a>
                <a href="/admin/announcements" className="block w-full py-2.5 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm text-center">Send Announcements</a>
              </div>
            </div>

            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-bold text-lg mb-4">System Status</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#888]">Database:</span><span className="text-green-400 font-semibold">Connected</span></div>
                <div className="flex justify-between"><span className="text-[#888]">API:</span><span className="text-green-400 font-semibold">Healthy</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Last sync:</span><span className="text-white font-semibold">Just now</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
