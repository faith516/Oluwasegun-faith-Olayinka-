import React from 'react';
import { Users, Info, TrendingUp, Shield, Zap } from 'lucide-react';
import { Player } from '../types';
import { formatNaira } from '../lib/utils';

interface SquadProps {
  squad: Player[];
}

export default function Squad({ squad }: SquadProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Squad Management</h2>
          <p className="text-sm text-neutral-400">Total Players: {squad.length}</p>
        </div>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <Zap className="w-4 h-4 text-yellow-500" />
          Quick Training
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-6 p-4 border-b border-neutral-800 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
          <div className="col-span-2">Player</div>
          <div className="text-center">Pos</div>
          <div className="text-center">Rating</div>
          <div className="text-center">Fitness</div>
          <div className="text-right">Value (₦)</div>
        </div>
        
        <div className="divide-y divide-neutral-800/50">
          {squad.map((player) => (
            <div key={player.id} className="grid grid-cols-6 p-4 items-center hover:bg-neutral-800/50 transition-colors cursor-pointer group">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center border border-neutral-700 font-bold group-hover:border-emerald-500/50 transition-colors">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold">{player.name}</p>
                  <p className="text-[10px] text-neutral-500">Professional</p>
                </div>
              </div>
              
              <div className="text-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  player.position === 'FWD' ? 'bg-red-500/10 text-red-400' :
                  player.position === 'MID' ? 'bg-blue-500/10 text-blue-400' :
                  player.position === 'DEF' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {player.position}
                </span>
              </div>
              
              <div className="text-center font-mono font-bold text-sm">
                {player.rating}
              </div>
              
              <div className="text-center">
                <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      player.fitness > 90 ? 'bg-emerald-500' :
                      player.fitness > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${player.fitness}%` }}
                  />
                </div>
              </div>
              
              <div className="text-right font-mono text-xs font-medium text-neutral-300">
                {formatNaira(player.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer List Suggestion */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="bg-emerald-600 p-3 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold">Scout Report</h4>
            <p className="text-sm text-neutral-400 italic">"Highly rated FW available in the transfer market for 1.2M ₦"</p>
          </div>
        </div>
        <button className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all">
          View Market
        </button>
      </div>
    </div>
  );
}
