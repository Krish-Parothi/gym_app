'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/lib/supabase';

export default function RevenuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [revenue, setRevenue] = useState({ total: 0, starter: 0, pro: 0, elite: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('rg_users').select('*').neq('role', 'admin');
      if (data) {
        const starter = data.filter(m => m.plan === 'Starter').length * 999;
        const pro = data.filter(m => m.plan === 'Pro').length * 1799;
        const elite = data.filter(m => m.plan === 'Elite').length * 2999;
        setRevenue({
          total: starter + pro + elite,
          starter,
          pro,
          elite,
        });
      }
      setDataLoading(false);
    })();
  }, []);

  if (loading || dataLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl font-black mb-6">Revenue Analytics</h1>

          <div className="bg-[#111111] rounded-2xl p-8 border border-white/10 mb-6">
            <p className="text-[#888] text-sm mb-2">Monthly Revenue (MRR)</p>
            <p className="text-white text-5xl font-black">₹{revenue.total.toLocaleString('en-IN')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm mb-2">Starter Plans</p>
              <p className="text-white text-3xl font-black">₹{revenue.starter.toLocaleString('en-IN')}</p>
              <p className="text-[#888] text-xs mt-2">999/month</p>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm mb-2">Pro Plans</p>
              <p className="text-white text-3xl font-black">₹{revenue.pro.toLocaleString('en-IN')}</p>
              <p className="text-[#888] text-xs mt-2">1799/month</p>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-white/10">
              <p className="text-[#888] text-sm mb-2">Elite Plans</p>
              <p className="text-white text-3xl font-black">₹{revenue.elite.toLocaleString('en-IN')}</p>
              <p className="text-[#888] text-xs mt-2">2999/month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
