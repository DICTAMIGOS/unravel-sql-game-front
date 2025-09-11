import React, { useState, useRef, useEffect } from 'react';
import type { SQLChallenge } from '../types/game';

interface SQLTemplateProps {
  challenge: SQLChallenge;
  onSolutionChange: (solution: string) => void;
  isCompleted: boolean;
  isIncorrect?: boolean;
  className?: string;
}

export const SQLTemplate: React.FC<SQLTemplateProps> = ({
  challenge,
  onSolutionChange,
  isCompleted,
  isIncorrect = false,
  className = ''
}) => {
  const [blanks, setBlanks] = useState<{ [key: string]: string }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Parse template to extract blanks
  const parseTemplate = (template: string) => {
    const parts = template.split('___');
    const blankKeys: string[] = [];
    
    for (let i = 0; i < parts.length - 1; i++) {
      blankKeys.push(`blank${i + 1}`);
    }
    
    return { parts, blankKeys };
  };

  useEffect(() => {
    // Parse template and initialize blanks
    const { blankKeys } = parseTemplate(challenge.template);
    const initialBlanks: { [key: string]: string } = {};
    blankKeys.forEach(key => {
      initialBlanks[key] = '';
    });
    setBlanks(initialBlanks);
    
    // Reset solution when challenge changes
    onSolutionChange('');
  }, [challenge.id, challenge.template, onSolutionChange]);

  const { parts, blankKeys } = parseTemplate(challenge.template);

  const handleInputChange = (blankKey: string, value: string) => {
    const newBlanks = { ...blanks, [blankKey]: value };
    setBlanks(newBlanks);
    
    // Generate current solution
    let solution = parts[0];
    for (let i = 0; i < blankKeys.length; i++) {
      solution += newBlanks[blankKeys[i]] + (parts[i + 1] || '');
    }
    
    onSolutionChange(solution.trim());
  };

  const getInputClassName = (): string => {
    const baseClass = "bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-w-0 flex-1 text-center font-mono";
    if (isCompleted) {
      return `${baseClass} bg-green-900 border-green-600 text-green-100`;
    }
    if (isIncorrect) {
      return `${baseClass} bg-red-900 border-red-600 text-red-100`;
    }
    return baseClass;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 font-mono text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-300">{part}</span>
              {index < blankKeys.length && (
                <div className="relative">
                  <input
                    ref={el => { inputRefs.current[blankKeys[index]] = el; }}
                    type="text"
                    value={blanks[blankKeys[index]] || ''}
                    onChange={(e) => handleInputChange(blankKeys[index], e.target.value)}
                    className={getInputClassName()}
                    placeholder="___"
                    disabled={isCompleted}
                    autoComplete="off"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};