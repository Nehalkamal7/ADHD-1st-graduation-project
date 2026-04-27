import React, { useEffect, useState } from 'react';

interface DistractionProps {
  isActive: boolean;
}

interface DistractionElement {
  id: number;
  type: string;
  top: number;
  color: string;
  animation: string;
  size: string;
}

export default function Distractions({ isActive }: DistractionProps) {
  const [elements, setElements] = useState<DistractionElement[]>([]);

  useEffect(() => {
    if (!isActive) {
      setElements([]);
      return;
    }

    const types = ['circle', 'square', 'triangle', 'star', 'emoji'];
    const colors = [
      'bg-red-400/40',
      'bg-blue-400/40',
      'bg-green-400/40',
      'bg-yellow-400/40',
      'bg-purple-400/40',
      'bg-pink-400/40',
    ];
    const animations = ['animate-distraction', 'animate-zigzag', 'animate-bounce'];
    const sizes = ['w-8 h-8', 'w-12 h-12', 'w-16 h-16'];
    const emojis = ['🎈', '⭐', '🌟', '🎯', '🎨', '🎪'];

    // Create multiple intervals with different frequencies
    const intervals = [
      setInterval(() => createElement(), 1500), // Fast elements
      setInterval(() => createElement(), 2000), // Medium speed elements
      setInterval(() => createElement(), 3000), // Slow elements
    ];

    function createElement() {
      const type = types[Math.floor(Math.random() * types.length)];
      const newElement = {
        id: Date.now() + Math.random(),
        type,
        top: Math.random() * (window.innerHeight - 200) + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        animation: animations[Math.floor(Math.random() * animations.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
      };

      setElements(prev => [...prev, newElement]);

      // Remove element after animation
      const duration = newElement.animation === 'animate-bounce' ? 5000 : 
                      newElement.animation === 'animate-zigzag' ? 4000 : 3000;

      setTimeout(() => {
        setElements(prev => prev.filter(el => el.id !== newElement.id));
      }, duration);
    }

    return () => {
      intervals.forEach(clearInterval);
      setElements([]);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
      {elements.map(element => (
        <div
          key={element.id}
          className={`
            absolute left-0 ${element.animation} ${element.size}
            ${element.type === 'circle' ? `rounded-full ${element.color}` : ''}
            ${element.type === 'square' ? `${element.color}` : ''}
            ${element.type === 'triangle' ? `triangle ${element.color}` : ''}
            ${element.type === 'star' ? `star ${element.color}` : ''}
            ${element.type === 'emoji' ? 'text-4xl animate-pulse' : ''}
          `}
          style={{
            top: element.top,
            ...(element.type === 'emoji' && {
              content: ['🎈', '⭐', '🌟', '🎯', '🎨', '🎪'][Math.floor(Math.random() * 6)],
            }),
          }}
        >
          {element.type === 'emoji' && ['🎈', '⭐', '🌟', '🎯', '🎨', '🎪'][Math.floor(Math.random() * 6)]}
        </div>
      ))}
    </div>
  );
}