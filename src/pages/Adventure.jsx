import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils/utils';
import { Button } from '../components/ui/button';
import { ArrowLeft, Star, Heart, Sparkles, Crown, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const storyData = {
  dragon: {
    chapters: [
      { id: 1, words: ['cave', 'dark', 'fire', 'rock', 'gold'], emoji: '🏔️' },
      { id: 2, words: ['lava', 'jump', 'bridge', 'hot', 'flames'], emoji: '🌋' },
      { id: 3, words: ['roar', 'wings', 'scales', 'breath', 'fight', 'brave', 'hero', 'victory'], emoji: '🐲', isBoss: true, bossName: 'Guardian Dragon' },
      { id: 4, words: ['treasure', 'jewels', 'diamonds', 'crown', 'riches'], emoji: '💎' },
      { id: 5, words: ['run', 'fast', 'escape', 'hurry', 'exit', 'freedom'], emoji: '💨' }
    ]
  },
  unicorn: {
    chapters: [
      { id: 1, words: ['magic', 'rainbow', 'flowers', 'trees', 'sparkle'], emoji: '🌸' },
      { id: 2, words: ['crystal', 'water', 'glow', 'shine', 'pure'], emoji: '💧' },
      { id: 3, words: ['storm', 'cloud', 'thunder', 'lightning', 'rainbow', 'colors', 'bright', 'hope'], emoji: '☁️', isBoss: true, bossName: 'Dark Cloud' },
      { id: 4, words: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'], emoji: '🌈' },
      { id: 5, words: ['happy', 'party', 'dance', 'friends', 'joy', 'celebration'], emoji: '🎉' }
    ]
  },
  robot: {
    chapters: [
      { id: 1, words: ['robot', 'space', 'station', 'fix', 'tools'], emoji: '🛠️' },
      { id: 2, words: ['asteroid', 'dodge', 'avoid', 'rocks', 'careful'], emoji: '☄️' },
      { id: 3, words: ['alien', 'laser', 'shield', 'beep', 'battle', 'power', 'circuit', 'victory'], emoji: '👾', isBoss: true, bossName: 'Alien Invader' },
      { id: 4, words: ['power', 'energy', 'electric', 'charge', 'battery'], emoji: '⚡' },
      { id: 5, words: ['home', 'earth', 'planet', 'success', 'mission', 'complete'], emoji: '🌍' }
    ]
  },
  wizard: {
    chapters: [
      { id: 1, words: ['castle', 'tower', 'magic', 'spell', 'wand'], emoji: '🏰' },
      { id: 2, words: ['book', 'spell', 'wizard', 'learn', 'wisdom'], emoji: '📚' },
      { id: 3, words: ['darkness', 'light', 'battle', 'magic', 'power', 'courage', 'destiny', 'triumph'], emoji: '🔮', isBoss: true, bossName: 'Dark Sorcerer' },
      { id: 4, words: ['peace', 'kingdom', 'happy', 'safe', 'harmony'], emoji: '👑' },
      { id: 5, words: ['hero', 'legend', 'champion', 'brave', 'honor', 'glory'], emoji: '🏆' }
    ]
  }
};

const characterEmojis = { dragon: '🐉', unicorn: '🦄', robot: '🤖', wizard: '🧙' };

export default function Adventure() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('character') || 'dragon';
  const chapterId = parseInt(urlParams.get('chapter')) || 1;
  
  const chapter = storyData[characterId]?.chapters.find(c => c.id === chapterId);
  const isBoss = chapter?.isBoss || false;
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [hearts, setHearts] = useState(3);
  const [stars, setStars] = useState(0);
  const [bossHealth, setBossHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [playerData, setPlayerData] = useState({ stars: 0, completedChapters: {}, defeatedBosses: [] });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBossDamage, setShowBossDamage] = useState(false);

  const currentWord = chapter?.words[currentWordIndex];

  useEffect(() => {
    const saved = localStorage.getItem('kidsTypingAdventure');
    if (saved) {
      setPlayerData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || levelComplete) return;
      
      if (e.key === 'Backspace') {
        setTypedText(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        const newText = typedText + e.key;
        setTypedText(newText);

        if (newText.toLowerCase() === currentWord.toLowerCase()) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 500);
          setTypedText('');
          setStars(prev => prev + 1);
          
          if (isBoss) {
            const damage = 100 / chapter.words.length;
            setBossHealth(prev => {
              const newHealth = Math.max(0, prev - damage);
              if (newHealth === 0) {
                completeBossLevel();
              }
              return newHealth;
            });
            setShowBossDamage(true);
            setTimeout(() => setShowBossDamage(false), 300);
          }
          
          if (currentWordIndex + 1 >= chapter.words.length) {
            if (!isBoss) {
              completeLevel();
            }
          } else {
            setCurrentWordIndex(prev => prev + 1);
          }
        } else if (!currentWord.toLowerCase().startsWith(newText.toLowerCase())) {
          setTypedText('');
          setHearts(prev => {
            const newHearts = prev - 1;
            if (newHearts <= 0) {
              setGameOver(true);
            }
            return newHearts;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [typedText, currentWord, gameOver, levelComplete, currentWordIndex]);

  const completeLevel = () => {
    setLevelComplete(true);
    const characterChapters = playerData.completedChapters?.[characterId] || [];
    const newCompletedChapters = [...new Set([...characterChapters, chapterId])];
    
    const newPlayerData = {
      ...playerData,
      stars: (playerData.stars || 0) + stars,
      completedChapters: {
        ...playerData.completedChapters,
        [characterId]: newCompletedChapters
      }
    };
    
    setPlayerData(newPlayerData);
    localStorage.setItem('kidsTypingAdventure', JSON.stringify(newPlayerData));
  };

  const completeBossLevel = () => {
    setLevelComplete(true);
    const characterChapters = playerData.completedChapters?.[characterId] || [];
    const newCompletedChapters = [...new Set([...characterChapters, chapterId])];
    const defeatedBosses = playerData.defeatedBosses || [];
    const bossId = `${characterId}_${chapterId}`;
    
    const newPlayerData = {
      ...playerData,
      stars: (playerData.stars || 0) + stars + 5, // Bonus stars for boss!
      completedChapters: {
        ...playerData.completedChapters,
        [characterId]: newCompletedChapters
      },
      defeatedBosses: [...new Set([...defeatedBosses, bossId])]
    };
    
    setPlayerData(newPlayerData);
    localStorage.setItem('kidsTypingAdventure', JSON.stringify(newPlayerData));
  };

  const restartLevel = () => {
    setCurrentWordIndex(0);
    setTypedText('');
    setHearts(3);
    setStars(0);
    setBossHealth(100);
    setGameOver(false);
    setLevelComplete(false);
  };

  const goToStory = () => {
    navigate(createPageUrl('Story', `character=${characterId}`));
  };

  if (!chapter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-30"
            initial={{ x: Math.random() * window.innerWidth, y: -50 }}
            animate={{ y: window.innerHeight + 50 }}
            transition={{ duration: Math.random() * 5 + 10, repeat: Infinity, delay: Math.random() * 3 }}
          >
            {isBoss ? '⚔️' : '✨'}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={goToStory}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm font-bold text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-10 h-10 ${i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300'}`}
                />
              ))}
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-black text-gray-800">{stars}</span>
            </div>
          </div>
        </div>

        {/* Boss Health Bar */}
        {isBoss && !gameOver && !levelComplete && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-3">
                <Skull className="w-10 h-10 text-red-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-gray-800">{chapter.bossName}</span>
                    <span className="text-xl font-bold text-red-600">{Math.round(bossHealth)}%</span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      initial={{ width: '100%' }}
                      animate={{ 
                        width: `${bossHealth}%`,
                        scale: showBossDamage ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <Crown className="w-10 h-10 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Character & Boss Display */}
        {isBoss && !gameOver && !levelComplete && (
          <div className="flex items-center justify-between mb-8">
            <motion.div
              animate={{ scale: showSuccess ? [1, 1.2, 1] : 1 }}
              className="text-9xl"
            >
              {characterEmojis[characterId]}
            </motion.div>
            <motion.div
              animate={{ 
                x: showBossDamage ? [0, -20, 0] : 0,
                rotate: showBossDamage ? [0, -10, 10, -10, 0] : 0
              }}
              className="text-9xl"
            >
              {chapter.emoji}
            </motion.div>
          </div>
        )}

        {/* Game Area */}
        {!gameOver && !levelComplete && (
          <motion.div
            key={currentWordIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`backdrop-blur-sm rounded-3xl p-12 mb-8 text-center shadow-2xl ${
              isBoss ? 'bg-red-500/20 border-4 border-red-400' : 'bg-white/95'
            }`}
          >
            {!isBoss && (
              <div className="text-7xl mb-6">{chapter.emoji}</div>
            )}
            
            <div className="mb-8">
              <div className="text-7xl font-black text-white mb-4 tracking-wider drop-shadow-lg">
                {currentWord.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={
                      i < typedText.length
                        ? typedText[i].toLowerCase() === letter.toLowerCase()
                          ? 'text-green-400'
                          : 'text-red-400'
                        : 'text-white'
                    }
                  >
                    {letter}
                  </span>
                ))}
              </div>
              
              <div className="h-3 bg-white/30 rounded-full w-full max-w-md mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(typedText.length / currentWord.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-2xl font-bold text-white drop-shadow-lg">
              {isBoss ? 'Defeat the boss!' : `Word ${currentWordIndex + 1} of ${chapter.words.length}`}
            </div>
          </motion.div>
        )}

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="text-9xl">🌟</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over */}
        {gameOver && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl"
          >
            <div className="text-8xl mb-6">😢</div>
            <h2 className="text-5xl font-black text-gray-800 mb-4">Try Again!</h2>
            <p className="text-2xl font-bold text-gray-600 mb-8">You earned {stars} stars!</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={restartLevel}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-2xl font-black px-8 py-6 rounded-2xl"
              >
                Try Again!
              </Button>
              <Button
                onClick={goToStory}
                variant="outline"
                className="text-2xl font-black px-8 py-6 rounded-2xl border-4"
              >
                Chapter List
              </Button>
            </div>
          </motion.div>
        )}

        {/* Level Complete */}
        {levelComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1.2, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-9xl mb-6"
            >
              {isBoss ? '👑' : '🎉'}
            </motion.div>
            <h2 className="text-5xl font-black text-gray-800 mb-4">
              {isBoss ? 'BOSS DEFEATED!' : 'Chapter Complete!'}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
              <span className="text-4xl font-black text-gray-800">
                +{isBoss ? stars + 5 : stars} Stars!
              </span>
            </div>
            {isBoss && (
              <p className="text-xl font-bold text-purple-600 mb-6">
                🎁 Bonus: +5 Stars for defeating the boss!
              </p>
            )}
            <Button
              onClick={goToStory}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-2xl font-black px-8 py-6 rounded-2xl"
            >
              <Sparkles className="w-8 h-8 mr-2 fill-white" />
              Continue Adventure!
            </Button>
          </motion.div>
        )}

        {!gameOver && !levelComplete && (
          <div className="text-center text-white text-xl font-bold drop-shadow-lg">
            ⌨️ {isBoss ? 'Type fast to defeat the boss!' : 'Start typing!'} ⌨️
          </div>
        )}
      </div>
    </div>
  );
}