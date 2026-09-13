import connectDB from './lib/mongodb.js';
import Destination from './lib/Destination.js';

const seedData = [
  {
    name: "কক্সবাজার",
    location: "চট্টগ্রাম বিভাগ",
    description: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত। ১২০ কিলোমিটার বিস্তৃত এই সৈকত প্রকৃতিপ্রেমীদের স্বর্গ।",
    latitude: 21.4272,
    longitude: 92.0058,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kolatoli_Sea_Beach_Cox%27s_Bazar.jpg/1280px-Kolatoli_Sea_Beach_Cox%27s_Bazar.jpg",
    category: "beach",
    visited: false,
  },
  {
    name: "সুন্দরবন",
    location: "খুলনা বিভাগ",
    description: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন এবং রয়েল বেঙ্গল টাইগারের আবাসস্থল। UNESCO World Heritage Site।",
    latitude: 21.9497,
    longitude: 89.1833,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tiger_in_Sundarban.jpg/1280px-Tiger_in_Sundarban.jpg",
    category: "forest",
    visited: false,
  },
  {
    name: "শ্রীমঙ্গল",
    location: "মৌলভীবাজার, সিলেট",
    description: "চায়ের রাজধানী। সবুজ চা বাগান, লাউয়াছড়া জাতীয় উদ্যান এবং সাত রঙের চায়ের জন্য বিখ্যাত।",
    latitude: 24.3067,
    longitude: 91.7317,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Tea_estate_in_Srimangal.jpg/1280px-Tea_estate_in_Srimangal.jpg",
    category: "other",
    visited: false,
  },
  {
    name: "বান্দরবান",
    location: "পার্বত্য চট্টগ্রাম",
    description: "পাহাড়ি সৌন্দর্যের লীলাভূমি। নীলগিরি, বগা লেক, নাফাখুম জলপ্রপাত এবং বৌদ্ধ মন্দিরের জন্য বিখ্যাত।",
    latitude: 22.1953,
    longitude: 92.2183,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Nilgiri_hill_in_Bandarban.jpg/1280px-Nilgiri_hill_in_Bandarban.jpg",
    category: "mountain",
    visited: false,
  },
  {
    name: "রাঙামাটি",
    location: "পার্বত্য চট্টগ্রাম",
    description: "কাপ্তাই লেকের উপর অবস্থিত পাহাড়ি জেলা। ঝুলন্ত সেতু ও রাজবন বিহারের জন্য পরিচিত।",
    latitude: 22.6432,
    longitude: 92.1806,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kaptai_Lake_Rangamati.jpg/1280px-Kaptai_Lake_Rangamati.jpg",
    category: "mountain",
    visited: false,
  },
  {
    name: "সেন্ট মার্টিন দ্বীপ",
    location: "টেকনাফ, কক্সবাজার",
    description: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ। স্বচ্ছ নীল জল এবং প্রবাল প্রাচীরের জন্য বিখ্যাত।",
    latitude: 20.6268,
    longitude: 92.3206,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/St._Martin%27s_Island_Bangladesh.jpg/1280px-St._Martin%27s_Island_Bangladesh.jpg",
    category: "island",
    visited: false,
  },
  {
    name: "কুয়াকাটা",
    location: "পটুয়াখালী",
    description: "সূর্যোদয় ও সূর্যাস্ত উভয়ই দেখা যায় এমন বিরল সমুদ্র সৈকত। 'সাগরকন্যা' নামে পরিচিত।",
    latitude: 21.8083,
    longitude: 90.1147,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kuakata_Sea_Beach.jpg/1280px-Kuakata_Sea_Beach.jpg",
    category: "beach",
    visited: false,
  },
  {
    name: "সিলেট",
    location: "সিলেট বিভাগ",
    description: "প্রকৃতির সৌন্দর্যে ভরপুর শহর। জাফলং, রাতারগুল, বিছনাকান্দি এবং চা বাগানের জন্য বিখ্যাত।",
    latitude: 24.8949,
    longitude: 91.8687,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Jaflong%2C_Sylhet.jpg/1280px-Jaflong%2C_Sylhet.jpg",
    category: "other",
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
    const created = await Destination.insertMany(seedData);
    return res.status(200).json({
      success: true,
      message: `✅ Seeded ${created.length} destinations!`,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
