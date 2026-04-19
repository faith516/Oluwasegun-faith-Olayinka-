import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Info, Activity, SkipForward, Users } from 'lucide-react';
import { Match } from '../types';

interface MatchSimProps {
  match: Match;
  teamRating: number;
  onFinish: (result: { homeScore: number; awayScore: number }) => void;
}

const COMMENTARY_LIST = [
  "Kick off! The game is underway.",
  "What a beautiful day for football in Lagos!",
  "Great passing from the home side.",
  "Dribbling past the defenders like they aren't there!",
  "The fans are going wild!",
  "A dangerous cross into the box...",
  "Corner kick for the Eagles.",
  "Stunning save by the goalkeeper!",
  "Strong tackle in the midfield.",
  "Into the final minutes of the half.",
  "Substitution warming up on the sideline.",
  "Yellow card for a reckless challenge."
];

const GOAL_COMMENTARY = [
  "GOAL!!! What a clinical finish!",
  "G-O-A-L! Absolutely incredible shot!",
  "It's in the net! The stadium is erupting!",
  "GOAAAAL! Top corner, untouchable!"
];

export default function MatchSim({ match, teamRating, onFinish }: MatchSimProps) {
  const [minutes, setMinutes] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [commentary, setCommentary] = useState<string[]>(["Welcome to the match!"]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setMinutes(prev => {
        if (prev >= 90) {
          clearInterval(timerRef.current!);
          setIsGameOver(true);
          return 90;
        }
        
        // Simulation Logic
        const newMin = prev + 1;
        
        // Random Commentary
        if (newMin % 10 === 0) {
          addCommentary(COMMENTARY_LIST[Math.floor(Math.random() * COMMENTARY_LIST.length)]);
        }

        // Scoring Chance
        const homeChance = (teamRating / 100) * 0.05;
        const awayChance = (match.opponentRating / 100) * 0.04;

        if (Math.random() < homeChance) {
          setHomeScore(s => s + 1);
          addCommentary(GOAL_COMMENTARY[Math.floor(Math.random() * GOAL_COMMENTARY.length)]);
        } else if (Math.random() < awayChance) {
          setAwayScore(s => s + 1);
          addCommentary(`Goal for ${match.opponent}! Shocking local defense.`);
        }

        // Ball movement
        setBallPosition({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60
        });

        return newMin;
      });
    }, 200); // Fast simulation: 1 min = 200ms

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const addCommentary = (text: string) => {
    setCommentary(prev => [text, ...prev].slice(0, 5));
  };

  const handleFinish = () => {
    onFinish({ homeScore, awayScore });
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
      {/* Scoreboard */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
        
        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-black mb-2 border-4 border-emerald-900 shadow-lg">
            GM
          </div>
          <span className="font-bold text-sm">Goal Master FC</span>
        </div>

        <div className="px-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="text-6xl font-black font-mono tracking-tighter">{homeScore}</span>
            <span className="text-2xl text-neutral-600 font-bold">:</span>
            <span className="text-6xl font-black font-mono tracking-tighter">{awayScore}</span>
          </div>
          <div className="bg-emerald-950 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold border border-emerald-900 flex items-center gap-2">
            <Timer className="w-3 h-3" />
            {minutes}'
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl font-black mb-2 border-4 border-neutral-700 shadow-lg capitalize">
            {match.opponent[0]}
          </div>
          <span className="font-bold text-sm text-center">{match.opponent}</span>
        </div>
      </div>

      {/* Visual Sim Grid */}
      <div className="flex-1 min-h-[300px] bg-emerald-900 border-8 border-neutral-800 rounded-3xl relative overflow-hidden pitch-grid shadow-inner">
        {/* Pitch markings */}
        <div className="absolute inset-0 border-2 border-white/10 m-4 rounded-[inherit] pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/20 rounded-full pointer-events-none" />
        
        {/* Ball */}
        <motion.div 
          animate={{ x: `${ballPosition.x}%`, y: `${ballPosition.y}%` }}
          transition={{ type: 'spring', damping: 20 }}
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-20 -ml-2 -mt-2 border border-neutral-300"
        />

        {/* Home Players Mock */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            animate={{ 
              x: `${15 + Math.random() * 20}%`, 
              y: `${10 + (i * 20) + Math.random() * 5}%` 
            }}
            className="absolute w-6 h-6 bg-emerald-500 rounded-full border-2 border-white/50 shadow-md"
          />
        ))}

        {/* Away Players Mock */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`a-${i}`}
            animate={{ 
              x: `${65 + Math.random() * 20}%`, 
              y: `${10 + (i * 20) + Math.random() * 5}%` 
            }}
            className="absolute w-6 h-6 bg-yellow-500 rounded-full border-2 border-white/50 shadow-md"
          />
        ))}

        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Match Finished</h2>
              <div className="text-2xl font-mono font-bold mb-8">
                {homeScore} - {awayScore}
              </div>
              <button 
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 flex items-center gap-3 mx-auto"
              >
                Collect Rewards
                <SkipForward className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Commentary */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 h-40 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10" />
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {commentary.map((text, i) => (
              <motion.div
                key={i + text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1 - (i * 0.2), x: 0 }}
                className="flex items-start gap-3"
              >
                <div className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold mt-1 shrink-0">
                  LIVE
                </div>
                <p className="text-sm font-medium text-neutral-300 italic">"{text}"</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
