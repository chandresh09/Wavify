import adele from '../assets/artists/adele.png';
import taylorSwift from '../assets/artists/taylor-swift.png';
import ladyGaga from '../assets/artists/lady-gaga.png';
import billieEilish from '../assets/artists/billie-eilish.png';
import edSheeran from '../assets/artists/ed-sheeran.png';
import coldplay from '../assets/artists/coldplay.png';
import celineDion from '../assets/artists/celine-dion.png';

// Static placeholder list. There is no artists API yet.
// When it exists, replace this file with a service call that returns { id, name, image }.
const popularArtists = [
  { id: 'adele', name: 'Adele', image: adele },
  { id: 'billie-eilish', name: 'Billie Eilish', image: billieEilish },
  { id: 'taylor-swift', name: 'Taylor Swift', image: taylorSwift },
  { id: 'ed-sheeran', name: 'Ed Sheeran', image: edSheeran },
  { id: 'lady-gaga', name: 'Lady Gaga', image: ladyGaga },
  { id: 'coldplay', name: 'Coldplay', image: coldplay },
  { id: 'celineDion', name: 'Celine Dion', image: celineDion },
];

export default popularArtists;
