import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils/utils';
import { Button } from '../components/ui/button';
import { ArrowLeft, Star, Crown, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const storyData = {
  dragon: {
    name: 'Drako\'s Treasure Hunt',
    emoji: '🐉',
    color: 'from-red-500 to-orange-500',
    chapters: [
      { 
        id: 1, 
        title: 'The Cave Entrance', 
        story: 'Drako found a mysterious cave. Help him enter by typing these words!',
        words: ['cave', 'dark', 'fire', 'rock', 'gold'],
        emoji: '🏔️'
      },
      { 
        id: 2, 
        title: 'The Lava River', 
        story: 'Oh no! A river of lava blocks the way. Type carefully!',
        words: ['lava', 'jump', 'bridge', 'hot', 'flames'],
        emoji: '🌋'
      },
      { 
        id: 3, 
        title: 'BOSS: The Guardian Dragon!', 
        story: 'A giant dragon guards the treasure! Type fast to defeat it!',
        words: ['roar', 'wings', 'scales', 'breath', 'fight', 'brave', 'hero', 'victory'],
        emoji: '🐲',
        isBoss: true,
        bossName: 'Guardian Dragon'
      },
      { 
        id: 4, 
        title: 'The Treasure Room', 
        story: 'You defeated the guardian! Now collect the treasure!',
        words: ['treasure', 'jewels', 'diamonds', 'crown', 'riches'],
        emoji: '💎'
      },
      { 
        id: 5, 
        title: 'The Great Escape', 
        story: 'The cave is collapsing! Type quickly to escape!',
        words: ['run', 'fast', 'escape', 'hurry', 'exit', 'freedom'],
        emoji: '💨'
      }
    ]
  },
  unicorn: {
    name: 'Sparkle\'s Magic Quest',
    emoji: '🦄',
    color: 'from-pink-500 to-purple-500',
    chapters: [
      { 
        id: 1, 
        title: 'The Enchanted Forest', 
        story: 'The magic forest is losing its colors! Help Sparkle restore it!',
        words: ['magic', 'rainbow', 'flowers', 'trees', 'sparkle'],
        emoji: '🌸'
      },
      { 
        id: 2, 
        title: 'The Crystal Lake', 
        story: 'Find the magic crystals in the glowing lake!',
        words: ['crystal', 'water', 'glow', 'shine', 'pure'],
        emoji: '💧'
      },
      { 
        id: 3, 
        title: 'BOSS: The Dark Cloud Monster!', 
        story: 'An evil cloud is stealing all the colors! Defeat it with rainbow power!',
        words: ['storm', 'cloud', 'thunder', 'lightning', 'rainbow', 'colors', 'bright', 'hope'],
        emoji: '☁️',
        isBoss: true,
        bossName: 'Dark Cloud'
      },
      { 
        id: 4, 
        title: 'The Rainbow Bridge', 
        story: 'Create a beautiful rainbow bridge with your typing!',
        words: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
        emoji: '🌈'
      },
      { 
        id: 5, 
        title: 'The Magic Celebration', 
        story: 'You saved the forest! Time to celebrate!',
        words: ['happy', 'party', 'dance', 'friends', 'joy', 'celebration'],
        emoji: '🎉'
      }
    ]
  },
  robot: {
    name: 'Robo\'s Space Mission',
    emoji: '🤖',
    color: 'from-blue-500 to-cyan-500',
    chapters: [
      { 
        id: 1, 
        title: 'The Broken Station', 
        story: 'The space station is damaged! Help Robo fix it!',
        words: ['robot', 'space', 'station', 'fix', 'tools'],
        emoji: '🛠️'
      },
      { 
        id: 2, 
        title: 'The Asteroid Field', 
        story: 'Navigate through dangerous asteroids!',
        words: ['asteroid', 'dodge', 'avoid', 'rocks', 'careful'],
        emoji: '☄️'
      },
      { 
        id: 3, 
        title: 'BOSS: The Alien Invader!', 
        story: 'An alien robot is attacking! Use your typing skills to defeat it!',
        words: ['alien', 'laser', 'shield', 'beep', 'battle', 'power', 'circuit', 'victory'],
        emoji: '👾',
        isBoss: true,
        bossName: 'Alien Invader'
      },
      { 
        id: 4, 
        title: 'The Power Core', 
        story: 'Restore power to the space station!',
        words: ['power', 'energy', 'electric', 'charge', 'battery'],
        emoji: '⚡'
      },
      { 
        id: 5, 
        title: 'Mission Complete', 
        story: 'The station is saved! Time to return home!',
        words: ['home', 'earth', 'planet', 'success', 'mission', 'complete'],
        emoji: '🌍'
      }
    ]
  },
  wizard: {
    name: 'Wizzy\'s Epic Battle',
    emoji: '🧙',
    color: 'from-purple-500 to-indigo-500',
    chapters: [
      { 
        id: 1, 
        title: 'The Dark Castle', 
        story: 'The Dark Sorcerer lives here. Enter carefully!',
        words: ['castle', 'tower', 'magic', 'spell', 'wand'],
        emoji: '🏰'
      },
      { 
        id: 2, 
        title: 'The Spell Library', 
        story: 'Learn powerful spells from ancient books!',
        words: ['book', 'spell', 'wizard', 'learn', 'wisdom'],
        emoji: '📚'
      },
      { 
        id: 3, 
        title: 'BOSS: The Dark Sorcerer!', 
        story: 'The final battle! Type the magic spells to win!',
        words: ['darkness', 'light', 'battle', 'magic', 'power', 'courage', 'destiny', 'triumph'],
        emoji: '🔮',
        isBoss: true,
        bossName: 'Dark Sorcerer'
      },
      { 
        id: 4, 
        title: 'The Kingdom Restored', 
        story: 'Peace has returned to the kingdom!',
        words: ['peace', 'kingdom', 'happy', 'safe', 'harmony'],
        emoji: '👑'
      },
      { 
        id: 5, 
        title: 'The Grand Ceremony', 
        story: 'The kingdom celebrates you as a hero!',
        words: ['hero', 'legend', 'champion', 'brave', 'honor', 'glory'],
        emoji: '🏆'
      }
    ]
  }
};

export default function Story() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('character') || 'dragon';
  
  const [playerData, setPlayerData] = useState({ 
    stars: 0, 
    completedChapters: {},
    defeatedBosses: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('kidsTypingAdventure');
    if (saved) {
      setPlayerData(JSON.parse(saved));
    }
  }, []);

  const story = storyData[characterId] || storyData.dragon;
  const completedChapters = playerData.completedChapters?.[characterId] || [];

  const isChapterUnlocked = (chapterId) => {
    if (chapterId === 1) return true;
    return completedChapters.includes(chapterId - 1);
  };

  const isChapterCompleted = (chapterId) => {
    return completedChapters.includes(chapterId);
  };

  const startChapter = (chapter) => {
    if (!isChapterUnlocked(chapter.id)) return;
    navigate(createPageUrl('Adventure', `character=${characterId}&chapter=${chapter.id}`));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${story.color} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            initial={{ x: Math.random() * window.innerWidth, y: -50 }}
            animate={{ y: window.innerHeight + 50 }}
            transition={{ duration: Math.random() * 8 + 12, repeat: Infinity, delay: Math.random() * 3 }}
          >
            {story.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Home'))}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm font-bold text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-black text-gray-800">{playerData.stars || 0}</span>
          </div>
        </div>

        {/* Story Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center shadow-2xl"
        >
          <div className="text-8xl mb-4">{story.emoji}</div>
          <h1 className="text-5xl font-black text-gray-800 mb-3">{story.name}</h1>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2">
            {/* <Trophy className="w-5 h-5 text-purple-600" /> */}
            <span className="text-lg font-bold text-gray-700">
              {completedChapters.length} / {story.chapters.length} Chapters Complete
            </span>
          </div>
        </motion.div>

        {/* Chapters */}
        <div className="space-y-6">
          {story.chapters.map((chapter, index) => {
            const unlocked = isChapterUnlocked(chapter.id);
            const completed = isChapterCompleted(chapter.id);
            
            return (
              <motion.div
                key={chapter.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all ${
                    unlocked ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]' : 'opacity-60'
                  } ${chapter.isBoss ? 'border-4 border-red-500' : ''}`}
                  onClick={() => unlocked && startChapter(chapter)}
                >
                  {/* Boss Badge */}
                  {chapter.isBoss && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3 shadow-lg animate-pulse">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Lock Badge */}
                  {!unlocked && (
                    <div className="absolute -top-3 -right-3 bg-gray-400 rounded-full p-3 shadow-lg">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Completed Badge */}
                  {completed && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 shadow-lg">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{chapter.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-800">
                          Chapter {chapter.id}: {chapter.title}
                        </h3>
                        {chapter.isBoss && (
                          <span className="bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-full">
                            BOSS BATTLE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 font-semibold mb-4 text-lg">{chapter.story}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-500">
                          {chapter.words.length} words to type
                        </div>
                        
                        {unlocked && (
                          <Button
                            className={`${
                              chapter.isBoss 
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                            } text-white font-black`}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {completed ? 'Play Again' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}