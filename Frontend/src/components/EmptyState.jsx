import { Disc3 } from 'lucide-react';

export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty-state">
      <Disc3 size={44} strokeWidth={1.3} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
