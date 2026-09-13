import connectDB from './lib/mongodb.js';
import Destination from './lib/Destination.js';

export const vadodaraTourData = [
  {
    stopNumber: 1,
    name: "Manjalpur Na Raja",
    location: "Manjalpur, Vadodara",
    distance: "Parul University → ~22–23 km",
    searchQuery: "Parul University to Manjalpur Na Raja Vadodara",
    description: "First stop on the tour route starting from Parul University (~22–23 km). One of the most grand and revered Ganpati mandals in the Manjalpur area.",
    latitude: 22.2612,
    longitude: 73.1895,
    imageUrl: "https://images.unsplash.com/photo-1567591414240-e1762e5b722d?auto=format&fit=crop&w=800&q=80",
    category: "manjalpur",
    visited: false,
  },
  {
    stopNumber: 2,
    name: "Icchapurti Ganesh",
    location: "Manjalpur, Vadodara",
    distance: "~2–3 km from Manjalpur Na Raja",
    searchQuery: "Manjalpur Na Raja to Icchapurti Ganesh Vadodara",
    description: "Famous wish-fulfilling Ganesh temple along the Manjalpur corridor, located 2–3 km from stop 1.",
    latitude: 22.2725,
    longitude: 73.1932,
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
    category: "manjalpur",
    visited: false,
  },
  {
    stopNumber: 3,
    name: "Manmohan Yuvak Mandal / Vadodara Na Maharaja",
    location: "Dandia Bazar, Vadodara",
    distance: "~1–2 km from Icchapurti Ganesh",
    searchQuery: "Icchapurti Ganesh to Manmohan Yuvak Mandal Vadodara",
    description: "Celebrated across Gujarat as 'Vadodara Na Maharaja', featuring awe-inspiring artistic idols and royal decorations.",
    latitude: 22.2965,
    longitude: 73.2035,
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010f445b985?auto=format&fit=crop&w=800&q=80",
    category: "old-city",
    visited: false,
  },
  {
    stopNumber: 4,
    name: "Pratap Maddha Ni Pol – Mangal Bazar",
    location: "Mangal Bazar, Old City, Vadodara",
    distance: "~5–6 km from Dandia Bazar",
    searchQuery: "Manmohan Yuvak Mandal to Pratap Maddha Ni Pol Mangal Bazar",
    description: "Located deep inside the historic heritage pols of Mangal Bazar, famous for traditional Barodian culture and vibrant decorations.",
    latitude: 22.3005,
    longitude: 73.2090,
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    category: "old-city",
    visited: false,
  },
  {
    stopNumber: 5,
    name: "Kalupura Cha Raja – Nava Bazar",
    location: "Nava Bazar, Old City, Vadodara",
    distance: "~1–2 km from Pratap Maddha Ni Pol",
    searchQuery: "Pratap Maddha Ni Pol to Kalupura Cha Raja Nava Bazar",
    description: "A prominent historic landmark in Nava Bazar, celebrated for majestic idol craftsmanship and devotional aartis.",
    latitude: 22.3045,
    longitude: 73.2085,
    imageUrl: "https://images.unsplash.com/photo-1609137144822-26302c0199e1?auto=format&fit=crop&w=800&q=80",
    category: "old-city",
    visited: false,
  },
  {
    stopNumber: 6,
    name: "Shree Kantareshwar Mahadev Yuvak Mandal – Bajwada",
    location: "Bajwada, Old City, Vadodara",
    distance: "~1 km from Nava Bazar",
    searchQuery: "Kalupura Cha Raja to Shree Kantareshwar Yuvak Mandal Bajwada",
    description: "Situated beside the ancient Kantareshwar Mahadev temple in Bajwada, known for spiritual ambiance and heritage rituals.",
    latitude: 22.3030,
    longitude: 73.2050,
    imageUrl: "https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80",
    category: "bajwada",
    visited: false,
  },
  {
    stopNumber: 7,
    name: "Koylifaliya Cha Gan Raja",
    location: "Koyli Faliya, Bajwada, Vadodara",
    distance: "~1–2 km from Kantareshwar Mandal",
    searchQuery: "Shree Kantareshwar Yuvak Mandal to Koylifaliya Cha Gan Raja",
    description: "Traditional residential faliya mandal in Bajwada famed for heartfelt devotion, heritage pol lights, and music.",
    latitude: 22.3020,
    longitude: 73.2040,
    imageUrl: "https://images.unsplash.com/photo-1567591414240-e1762e5b722d?auto=format&fit=crop&w=800&q=80",
    category: "bajwada",
    visited: false,
  },
  {
    stopNumber: 8,
    name: "Bajwada Hanuman Pole Yuvak Mandal",
    location: "Hanuman Pole, Bajwada, Vadodara",
    distance: "~1–2 km from Koyli Faliya",
    searchQuery: "Koylifaliya Cha Gan Raja to Bajwada Hanuman Pole Yuvak Mandal",
    description: "Iconic Hanuman Pole community celebration attracting thousands of visitors with illuminated street canopies.",
    latitude: 22.3015,
    longitude: 73.2055,
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
    category: "bajwada",
    visited: false,
  },
  {
    stopNumber: 9,
    name: "Shree Rajsthambh Parivar – Navapura",
    location: "Navapura, Vadodara",
    distance: "~2–3 km from Bajwada",
    searchQuery: "Bajwada Hanuman Pole to Shree Rajsthambh Parivar Navapura",
    description: "A grand community mandal in the vibrant neighborhood of Navapura, featuring creative mythological themes.",
    latitude: 22.2960,
    longitude: 73.1990,
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010f445b985?auto=format&fit=crop&w=800&q=80",
    category: "navapura",
    visited: false,
  },
  {
    stopNumber: 10,
    name: "Shree Rajsthambh Society – Navapura",
    location: "Navapura, Vadodara",
    distance: "~1 km from Rajsthambh Parivar",
    searchQuery: "Shree Rajsthambh Parivar to Shree Rajsthambh Society Navapura",
    description: "Neighboring society mandal in Navapura with high festive energy, traditional drums, and community prasad distribution.",
    latitude: 22.2940,
    longitude: 73.1980,
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    category: "navapura",
    visited: false,
  },
  {
    stopNumber: 11,
    name: "Azad Group Cha Raja – Kishanwadi",
    location: "Kishanwadi, Vadodara",
    distance: "~4–5 km from Navapura",
    searchQuery: "Shree Rajsthambh Society to Azad Group Cha Raja Kishanwadi",
    description: "Final grand finale destination of the tour! Legendary youth mandal in Kishanwadi celebrated for massive crowds and electric atmosphere.",
    latitude: 22.3080,
    longitude: 73.2260,
    imageUrl: "https://images.unsplash.com/photo-1609137144822-26302c0199e1?auto=format&fit=crop&w=800&q=80",
    category: "kishanwadi",
    visited: false,
  },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to seed.' });
  }

  try {
    await connectDB();
    await Destination.deleteMany({});
    const created = await Destination.insertMany(vadodaraTourData);
    return res.status(200).json({
      success: true,
      message: `Successfully seeded all ${created.length} Vadodara tour destinations!`,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
