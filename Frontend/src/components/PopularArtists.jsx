import popularArtists from '../data/popularArtists';
import Carousel from './Carousel';

// Display only. Artists are not clickable yet.
export default function PopularArtists() {
  return (
    <section className="section">
      <h2 className="section-title">Popular Artists</h2>
      <Carousel>
        {popularArtists.map((artist) => (
          <div className="carousel-item artist-item" key={artist.id}>
            <img className="artist-image" src={artist.image} alt={artist.name} loading="lazy" />
            <p className="artist-name">{artist.name}</p>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
