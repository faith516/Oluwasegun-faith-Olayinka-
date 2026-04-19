import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Award, Clock, DollarSign, ChevronRight, Activity, Users } from 'lucide-react';
import { TeamStats, Match } from '../types';
import { formatNaira } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardProps {
  stats: TeamStats;
  matchHistory: Match[];
  startMatch: () => void;
}

const mockChartData = [
  { day: 'Mon', earnings: 45000 },
  { day: 'Tue', earnings: 120000 },
  { day: 'Wed', earnings: 85000 },
  { day: 'Thu', earnings: 210000 },
  { day: 'Fri', earnings: 150000 },
  { day: 'Sat', earnings: 450000 },
  { day: 'Sun', earnings: 320000 },
];

export default function Dashboard({ stats, matchHistory, startMatch }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Weekly Earnings" 
          value={formatNaira(stats.totalEarnings)} 
          sub="from 7 matches"
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
          trend="+12%"
        />
        <StatCard 
          label="Win Ratio" 
          value={`${stats.wins + stats.draws + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.draws + stats.losses)) * 100) : 0}%`} 
          sub={`${stats.wins} wins this season`}
          icon={<Award className="w-5 h-5 text-yellow-400" />}
          trend="+5%"
        />
        <StatCard 
          label="Club Value" 
          value={formatNaira(8500000)} 
          sub="Ranked #14"
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        />
        <StatCard 
          label="Next Match" 
          value="In 2h 45m" 
          sub="vs Rivers United"
          icon={<Clock className="w-5 h-5 text-orange-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Revenue Overview</h3>
              <p className="text-sm text-neutral-400">Projected weekly earnings in Naira</p>
            </div>
            <select className="bg-neutral-800 border-none rounded-lg text-xs font-bold p-2 focus:ring-2 focus:ring-emerald-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737373', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  hide
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Results</h3>
            <button className="text-xs text-emerald-400 font-bold hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {matchHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-neutral-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-neutral-500" />
                </div>
                <p className="text-neutral-500 text-sm">No matches played yet.</p>
                <button 
                  onClick={startMatch}
                  className="mt-4 text-emerald-400 text-sm font-bold"
                >
                  Start your first match
                </button>
              </div>
            ) : (
              matchHistory.slice(0, 5).map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 group cursor-pointer hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
                      {match.opponent[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{match.opponent}</p>
                      <p className="text-[10px] text-neutral-500">{match.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold">
                        {match.result?.homeScore} - {match.result?.awayScore}
                      </p>
                      <p className={`text-[10px] font-bold ${match.result && match.result.homeScore > match.result.awayScore ? 'text-emerald-400' : 'text-red-400'}`}>
                        {match.earnings ? `+${formatNaira(match.earnings)}` : '-'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Finance & Monetization Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">Monetization Strategy</h3>
          </div>
          <p className="text-sm text-neutral-400 mb-6">
            Your club generates revenue through multiple streams. Scale these to increase your weekly payouts in Naira.
          </p>
          <div className="space-y-4">
            <MonetizationRow label="Ad Revenue" value={formatNaira(stats.totalEarnings * 0.15)} trend="+₦1,200 today" />
            <MonetizationRow label="Sponsorships" value={formatNaira(stats.wins * 50000)} trend="+₦50k / win" />
            <MonetizationRow label="Ticket Sales" value={formatNaira(stats.totalEarnings * 0.4)} trend="85% Attendance" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Premium</div>
          </div>
          <h3 className="text-lg font-bold mb-4">Weekly Payout Overview</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black">{formatNaira(stats.totalEarnings)}</span>
            <span className="text-xs text-neutral-500 font-bold uppercase">Pending</span>
          </div>
          <p className="text-xs text-neutral-400 mb-6">Next payout date: <span className="text-emerald-400 font-bold">Next Sunday, 12:00 PM</span></p>
          
          <button className="w-full bg-white text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors">
            Upgrade to Pro Manager
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-center text-neutral-500 mt-3">Boost earnings by 2.5x with Pro Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function MonetizationRow({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-black/20">
      <div>
        <p className="text-xs font-bold text-neutral-400">{label}</p>
        <p className="text-sm font-mono font-bold">{value}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-emerald-400">{trend}</p>
      </div>
    </div>
  );
}


function StatCard({ label, value, sub, icon, trend }: { label: string; value: string; subText?: string; icon: React.ReactNode; trend?: string; sub: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-neutral-800 p-2 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
        <p className="text-[10px] text-neutral-600 font-medium mt-1">{sub}</p>
      </div>
    </div>
  );
}
