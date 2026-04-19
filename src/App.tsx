/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Users, DollarSign, Activity, Play, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNaira } from './lib/utils';
import { Player, Match, TeamStats } from './types';
import { INITIAL_SQUAD, TEAMS_NG } from './constants';
import Dashboard from './components/Dashboard';
import Squad from './components/Squad';
import MatchSim from './components/MatchSim';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'squad' | 'match'>('dashboard');
  const [stats, setStats] = useState<TeamStats>({
    wins: 0,
    draws: 0,
    losses: 0,
    totalEarnings: 0,
    balance: 1500000, // Initial balance in ₦
  });
  const [squad, setSquad] = useState<Player[]>(INITIAL_SQUAD);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const handleMatchFinish = (result: { homeScore: number; awayScore: number }) => {
    if (!currentMatch) return;

    const earnings = result.homeScore > result.awayScore ? 250000 : result.homeScore === result.awayScore ? 100000 : 25000;
    
    const updatedMatch = { ...currentMatch, result, earnings };
    setMatchHistory([updatedMatch, ...matchHistory]);
    
    setStats(prev => ({
      ...prev,
      wins: prev.wins + (result.homeScore > result.awayScore ? 1 : 0),
      draws: prev.draws + (result.homeScore === result.awayScore ? 1 : 0),
      losses: prev.losses + (result.homeScore < result.awayScore ? 1 : 0),
      totalEarnings: prev.totalEarnings + earnings,
      balance: prev.balance + earnings
    }));

    setCurrentMatch(null);
    setActiveTab('dashboard');
  };

  const startNewMatch = () => {
    const opponent = TEAMS_NG[Math.floor(Math.random() * TEAMS_NG.length)];
    const newMatch: Match = {
      id: Date.now().toString(),
      opponent,
      opponentRating: 70 + Math.floor(Math.random() * 15),
      date: new Date().toLocaleDateString(),
    };
    setCurrentMatch(newMatch);
    setActiveTab('match');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Goal Master <span className="text-emerald-500">NG</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Account Balance</span>
              <span className="text-sm font-mono font-medium text-emerald-400">{formatNaira(stats.balance)}</span>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard 
                stats={stats} 
                matchHistory={matchHistory} 
                startMatch={startNewMatch} 
              />
            </motion.div>
          )}

          {activeTab === 'squad' && (
            <motion.div
              key="squad"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Squad squad={squad} />
            </motion.div>
          )}

          {activeTab === 'match' && currentMatch && (
            <motion.div
              key="match"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full"
            >
              <MatchSim 
                match={currentMatch} 
                teamRating={80} 
                onFinish={handleMatchFinish} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Rail / Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-lg lg:static lg:bg-transparent lg:border-t-0 p-2 sm:p-4">
        <div className="max-w-md mx-auto lg:max-w-none flex justify-around lg:justify-center lg:gap-8">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<Activity className="w-5 h-5" />} 
            label="Dashboard" 
          />
          <NavButton 
            active={activeTab === 'squad'} 
            onClick={() => setActiveTab('squad')} 
            icon={<Users className="w-5 h-5" />} 
            label="Squad" 
          />
          <button 
            onClick={startNewMatch}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all bg-emerald-600 hover:bg-emerald-500 scale-110 -translate-y-2 lg:translate-y-0"
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Play</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
        active ? 'text-emerald-400 bg-white/5' : 'text-neutral-500 hover:text-neutral-300'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
