import React from 'react';

/**
 * Utility to parse and format text containing @mentions (e.g. @golden_heritage, @rahim_c)
 * and #hashtags into interactive styled spans.
 */
export const renderWithMentions = (text: string): React.ReactNode => {
  if (!text) return null;
  const parts = text.split(/(@[\w\u0980-\u09FF]+|#[\w\u0980-\u09FF]+)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('@')) {
      return (
        <span
          key={idx}
          className="text-amber-400 font-bold bg-amber-500/15 hover:bg-amber-500/25 px-1 py-0.5 rounded transition-colors cursor-pointer inline-block mx-0.5"
          title={`Account Mention: ${part}`}
        >
          {part}
        </span>
      );
    }
    if (part.startsWith('#')) {
      return (
        <span
          key={idx}
          className="text-amber-300 font-mono font-medium hover:underline cursor-pointer inline-block mx-0.5"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

export const POPULAR_MENTIONS = [
  '@golden_heritage',
  '@star_tech',
  '@sultana_admin',
  '@tanvir_looks',
  '@rahim_c',
  '@sadia_s'
];
