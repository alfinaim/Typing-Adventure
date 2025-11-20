import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils/utils';
import { Button } from '../components/ui/button';
import { Sparkles, Star, Trophy, Zap, Lock, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const characters = [
  { 
    id: 'dragon', 
    name: 'Drako the Dragon', 
    emoji: '🐉', 
    color: 'from-red-500 to-orange-500',
    story: 'Help Drako find the lost treasure in the Volcano Mountain!',
    unlocked: true 
  },
  { 
    id: 'unicorn', 
    name: 'Sparkle the Unicorn', 
    emoji: '🦄', 
    color: 'from-pink-500 to-purple-500',
    story: 'Save the Magic Forest with Sparkle\'s rainbow powers!',
    unlocked: false, 
    requirement: 25 
  },
  { 
    id: 'robot', 
    name: 'Robo the Robot', 
    emoji: '🤖', 
    color: 'from-blue-500 to-cyan-500',
    story: 'Fix the Space Station with Robo\'s tech skills!',
    unlocked: false, 
    requirement: 50 
  },
  { 
    id: 'wizard', 
    name: 'Wizzy the Wizard', 
    emoji: '🧙', 
    color: 'from-purple-500 to-indigo-500',
    story: 'Defeat the Dark Sorcerer and restore peace to the kingdom!',
    unlocked: false, 
    requirement: 75 
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState({ 
    stars: 0, 
    completedChapters: {}, 
    selectedCharacter: 'dragon',
    defeatedBosses: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('kidsTypingAdventure');
    if (saved) {
      setPlayerData(JSON.parse(saved));
    }
  }, []);

  const getTotalStars = () => playerData.stars || 0;
  
  const isCharacterUnlocked = (char) => {
    if (char.unlocked) return true;
    return getTotalStars() >= char.requirement;
  };

  const getCharacterProgress = (charId) => {
    const completed = playerData.completedChapters?.[charId] || [];
    return completed.length;
  };

  const selectCharacter = (charId) => {
    const char = characters.find(c => c.id === charId);
    if (!isCharacterUnlocked(char)) return;
    
    const newData = { ...playerData, selectedCharacter: charId };
    setPlayerData(newData);
    localStorage.setItem('kidsTypingAdventure', JSON.stringify(newData));
    navigate(createPageUrl('Story', `character=${charId}`));
  };

  const getBossesDefeated = () => {
    return playerData.defeatedBosses?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ x: Math.random() * window.innerWidth, y: -100 }}
            animate={{ 
              y: window.innerHeight + 100,
              x: Math.random() * window.innerWidth 
            }}
            transition={{ 
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
            🎮 Typing Adventure! 🎮
          </h1>
          <p className="text-2xl text-white font-bold drop-shadow-lg">
            Choose your hero and start the adventure!
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                <Star className="w-10 h-10 text-white fill-white" />
              </div>
              <div>
                <div className="text-5xl font-black text-gray-800">{getTotalStars()}</div>
                <div className="text-xl font-bold text-gray-600">Total Stars</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-black text-gray-800">
                  {Object.values(playerData.completedChapters || {}).flat().length}
                </div>
                <div className="text-xl font-bold text-gray-600">Chapters Done</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-black text-gray-800">{getBossesDefeated()}</div>
                <div className="text-xl font-bold text-gray-600">Bosses Defeated</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Character Selection */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Choose Your Hero!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characters.map((char) => {
              const unlocked = isCharacterUnlocked(char);
              const progress = getCharacterProgress(char.id);
              
              return (
                <motion.button
                  key={char.id}
                  whileHover={unlocked ? { scale: 1.05 } : {}}
                  whileTap={unlocked ? { scale: 0.95 } : {}}
                  onClick={() => selectCharacter(char.id)}
                  disabled={!unlocked}
                  className={`relative p-6 rounded-2xl transition-all text-left ${
                    unlocked 
                      ? `bg-gradient-to-br ${char.color} cursor-pointer shadow-lg hover:shadow-2xl` 
                      : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {!unlocked && (
                    <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-sm rounded-full p-2">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  <div className="text-7xl mb-3">{char.emoji}</div>
                  <div className="text-2xl font-black text-white mb-2">{char.name}</div>
                  <p className="text-white/90 font-semibold mb-4 text-sm leading-relaxed">
                    {char.story}
                  </p>
                  
                  {unlocked ? (
                    <div className="flex items-center justify-between">
                      <div className="text-white font-bold">
                        {progress > 0 ? `${progress} Chapters ✓` : 'Start Adventure!'}
                      </div>
                      <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1">
                        <Zap className="w-5 h-5 text-white inline" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-white font-bold flex items-center gap-2">
                      <Star className="w-5 h-5 fill-white" />
                      Need {char.requirement} stars
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}