import { Link } from 'react-router-dom';
import bannerArtist from '../assets/banner-artist.png';

// Shown instead of music content when nobody is logged in.
export default function LoginBanner() {
  return (
    <section className="login-banner">
      <img className="login-banner-art" src={bannerArtist} alt="" />
      <div className="login-banner-copy">
        <h1>Log in first</h1>
        <p className="login-banner-accent">to access music</p>
        <p className="login-banner-sub">Sign in to stream tracks and open albums.</p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary btn-sm">Listen now</Link>
          <Link to="/login" className="btn btn-outline btn-sm">Follow</Link>
        </div>
      </div>
    </section>
  );
}
