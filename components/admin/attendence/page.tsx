'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/lib/supabase';

export default function AttendancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, avg: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('rg_attendance').select('*');
      const today = new Date().toISOString().split('T')[0];
      const week = new Date();
      week.setDate(week.getDate() - 7);
      const month = new Date();
      month.setDate(month.getDate() - 30);

      const todayCount = data?.filter(a => a.date === today).length || 0;
      const weekCount = data?.filter(a => a.date > week.toISOString().split('T')[0]).length || 0;
      const monthCount = data?.filter(a => a.date > month.toISOString().split('T')[0]).length || 0;

      setStats({
        today: todayCount,
        week: weekCount,
        month: monthCount,
        avg: Math.round(monthCount / 30),
      });
      setDataLoading(false);
    })();
  }, []);

  if (loading || dataLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl font-black mb-6">Attendance Reports</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm">Today</p>
              <p className="text-white text-4xl font-black mt-2">{stats.today}</p>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm">Last 7 Days</p>
              <p className="text-white text-4xl font-black mt-2">{stats.week}</p>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm">Last 30 Days</p>
              <p className="text-white text-4xl font-black mt-2">{stats.month}</p>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm">Daily Average</p>
              <p className="text-white text-4xl font-black mt-2">{stats.avg}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
