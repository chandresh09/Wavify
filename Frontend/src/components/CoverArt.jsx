import { useState } from 'react';
import { Music } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg, #4b3fd6, #1b1760)',
  'linear-gradient(135deg, #7c6ff7, #2a2a72)',
  'linear-gradient(135deg, #3a5bd9, #151a4a)',
  'linear-gradient(135deg, #8a5cf5, #321c6b)',
  'linear-gradient(135deg, #2f80ed, #1a1f5c)',
];

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export default function CoverArt({ src, title = '', className = '' }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        className={`cover ${className}`}
        src={src}
        alt={title ? `${title} cover` : 'Cover art'}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`cover cover-fallback ${className}`}
      style={{ background: GRADIENTS[hashText(title) % GRADIENTS.length] }}
      role="img"
      aria-label={title ? `${title} cover` : 'Cover art'}
    >
      <Music size={36} strokeWidth={1.5} />
    </div>
  );
}
