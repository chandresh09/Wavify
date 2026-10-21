import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ children }) {
  const trackRef = useRef(null);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="carousel-track" ref={trackRef}>{children}</div>
      <button type="button" className="carousel-btn left" aria-label="Scroll left" onClick={() => scrollByPage(-1)}>
        <ChevronLeft size={20} />
      </button>
      <button type="button" className="carousel-btn right" aria-label="Scroll right" onClick={() => scrollByPage(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
