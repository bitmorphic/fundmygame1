export interface Athlete {
  id: string;
  name: string;
  sport: string;
  state: string;
  city: string;
  age: number;
  avatar: string;
  athleteScore: number;
  underdogScore: number;
  trendingScore: number;
  impactScore: number;
  growthPrediction: number;
  fundsReceived: number;
  fundingGoal: number;
  achievements: string[];
  bio: string;
  timeline: { year: number; event: string }[];
  stats: { label: string; value: string }[];
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  budget: string;
  athletesSponsored: number;
}

export const athletes: Athlete[] = [
  {
    id: "1",
    name: "Akshita Deshwal",
    sport: "Boxing",
    state: "Haryana",
    city: "Panipat",
    age: 19,
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face",
    athleteScore: 92,
    underdogScore: 88,
    trendingScore: 95,
    impactScore: 78,
    growthPrediction: 34,
    fundsReceived: 45000,
    fundingGoal: 150000,
    achievements: ["State Gold Medalist", "National Quarter-Finalist", "District Champion 3x"],
    bio: "From a farming family in Bhiwani, training in an open-air ring. Dreams of representing India at the Olympics.",
    timeline: [
      { year: 2020, event: "Started boxing at local akhada" },
      { year: 2021, event: "Won district championship" },
      { year: 2022, event: "State gold medal - 54kg" },
      { year: 2023, event: "National quarter-finalist" },
    ],
    stats: [
      { label: "Matches", value: "47" },
      { label: "Wins", value: "41" },
      { label: "KO Ratio", value: "62%" },
      { label: "Ranking", value: "#12 India" },
    ],
  },
  {
    id: "2",
    name: "Noman Khan",
    sport: "Archery",
    state: "Uttar Pradesh",
    city: "Ranchi",
    age: 17,
    avatar: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&h=200&fit=crop&crop=face",
    athleteScore: 85,
    underdogScore: 94,
    trendingScore: 72,
    impactScore: 65,
    growthPrediction: 42,
    fundsReceived: 18000,
    fundingGoal: 200000,
    achievements: ["Tribal Sports Gold", "State Archery Silver", "Jharkhand U-18 Champion"],
    bio: "Learned archery from tribal traditions. Uses a handmade bow. Needs modern equipment to compete nationally.",
    timeline: [
      { year: 2019, event: "First bow — handmade by grandfather" },
      { year: 2021, event: "Tribal sports festival gold" },
      { year: 2022, event: "Spotted by district coach" },
      { year: 2023, event: "State silver medal" },
    ],
    stats: [
      { label: "Best Score", value: "672/720" },
      { label: "Avg Score", value: "648" },
      { label: "Events", value: "23" },
      { label: "Medals", value: "8" },
    ],
  },
  {
    id: "3",
    name: "Harsha",
    sport: "Weightlifting",
    state: "Manipur",
    city: "Imphal",
    age: 21,
    avatar: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=face",
    athleteScore: 89,
    underdogScore: 76,
    trendingScore: 88,
    impactScore: 82,
    growthPrediction: 28,
    fundsReceived: 92000,
    fundingGoal: 300000,
    achievements: ["National Bronze", "Northeast Games Gold", "Commonwealth Trials Qualifier"],
    bio: "Following in the footsteps of Mirabai Chanu. Trains at Imphal's government facility. Needs international exposure.",
    timeline: [
      { year: 2018, event: "Joined state weightlifting academy" },
      { year: 2020, event: "Northeast Games gold - 49kg" },
      { year: 2022, event: "National bronze medal" },
      { year: 2023, event: "Qualified for Commonwealth trials" },
    ],
    stats: [
      { label: "Snatch", value: "82kg" },
      { label: "C&J", value: "105kg" },
      { label: "Total", value: "187kg" },
      { label: "Category", value: "49kg" },
    ],
  },
  {
    id: "4",
    name: "Anas Khan",
    sport: "Wrestling",
    state: "Uttar Pradesh",
    city: "Lucknow",
    age: 22,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    athleteScore: 78,
    underdogScore: 91,
    trendingScore: 65,
    impactScore: 58,
    growthPrediction: 38,
    fundsReceived: 12000,
    fundingGoal: 180000,
    achievements: ["Dangal Champion", "District Gold 2x", "State Semi-Finalist"],
    bio: "Trains at a mud akhada near the ghats. No mat, no coach salary. Raw talent waiting to be polished.",
    timeline: [
      { year: 2017, event: "Started wrestling at local akhada" },
      { year: 2020, event: "First dangal victory" },
      { year: 2022, event: "District gold - freestyle 74kg" },
      { year: 2023, event: "State semi-finalist" },
    ],
    stats: [
      { label: "Bouts", value: "65" },
      { label: "Wins", value: "52" },
      { label: "Pins", value: "31" },
      { label: "Category", value: "74kg" },
    ],
  },
  {
    id: "5",
    name: "Deepa Nair",
    sport: "Athletics",
    state: "Kerala",
    city: "Kozhikode",
    age: 18,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    athleteScore: 87,
    underdogScore: 70,
    trendingScore: 91,
    impactScore: 74,
    growthPrediction: 45,
    fundsReceived: 67000,
    fundingGoal: 250000,
    achievements: ["Kerala State 100m Gold", "National School Games Silver", "Junior Federation Cup Finalist"],
    bio: "Clocked 11.8s in 100m on a mud track. With proper training, she could break national junior records.",
    timeline: [
      { year: 2020, event: "School sports day — discovered by PE teacher" },
      { year: 2021, event: "State school games gold" },
      { year: 2022, event: "National school games silver - 100m" },
      { year: 2023, event: "Junior Federation Cup finalist" },
    ],
    stats: [
      { label: "100m", value: "11.8s" },
      { label: "200m", value: "24.1s" },
      { label: "Events", value: "34" },
      { label: "Medals", value: "15" },
    ],
  },
  {
    id: "6",
    name: "Suraj Toppo",
    sport: "Hockey",
    state: "Odisha",
    city: "Sundargarh",
    age: 20,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    athleteScore: 83,
    underdogScore: 85,
    trendingScore: 77,
    impactScore: 69,
    growthPrediction: 31,
    fundsReceived: 34000,
    fundingGoal: 175000,
    achievements: ["Sub-Junior Nationals Participant", "Sundargarh District Gold", "Hockey India League Scout"],
    bio: "From the hockey heartland of India. Plays barefoot on dirt grounds. Spotted by Hockey India scouts.",
    timeline: [
      { year: 2018, event: "Picked up first hockey stick" },
      { year: 2020, event: "District tournament gold" },
      { year: 2022, event: "Sub-junior nationals participation" },
      { year: 2023, event: "Scouted by Hockey India League" },
    ],
    stats: [
      { label: "Goals", value: "43" },
      { label: "Assists", value: "28" },
      { label: "Matches", value: "72" },
      { label: "Position", value: "Forward" },
    ],
  },
];

export const sponsors: Sponsor[] = [
  { id: "1", name: "SportMax India", logo: "SM", industry: "Sports Equipment", budget: "₹10L–50L", athletesSponsored: 24 },
  { id: "2", name: "FitFuel Nutrition", logo: "FF", industry: "Nutrition", budget: "₹5L–20L", athletesSponsored: 18 },
  { id: "3", name: "KhelIndia Foundation", logo: "KI", industry: "NGO", budget: "₹2L–10L", athletesSponsored: 45 },
  { id: "4", name: "Tata Sports", logo: "TS", industry: "Conglomerate", budget: "₹50L+", athletesSponsored: 12 },
];

export const sponsorMatchScores: Record<string, number> = {
  "1-1": 92, "1-2": 78, "1-3": 85, "1-4": 65,
  "2-1": 88, "2-2": 72, "2-3": 91, "2-4": 80,
  "3-1": 76, "3-2": 95, "3-3": 68, "3-4": 82,
  "4-1": 84, "4-2": 69, "4-3": 73, "4-4": 90,
};

export const stateAthleteCount: Record<string, number> = {
  "Haryana": 1420, "Punjab": 980, "Kerala": 870, "Manipur": 650,
  "Jharkhand": 540, "Odisha": 720, "Maharashtra": 1650, "Tamil Nadu": 1100,
  "Uttar Pradesh": 1350, "West Bengal": 780, "Rajasthan": 620,
  "Karnataka": 930, "Assam": 410, "Bihar": 580, "Gujarat": 490,
  "Madhya Pradesh": 550, "Andhra Pradesh": 670, "Telangana": 510,
  "Chhattisgarh": 320, "Uttarakhand": 290,
};

export const fundingTiers = [
  { amount: 100, label: "Cheer", description: "Show your support", emoji: "👏" },
  { amount: 250, label: "Boost", description: "Help with nutrition", emoji: "⚡" },
  { amount: 500, label: "Champion", description: "Fund training gear", emoji: "🏆" },
  { amount: 1000, label: "Patron", description: "Monthly training support", emoji: "🌟" },
  { amount: 5000, label: "Sponsor", description: "Major equipment upgrade", emoji: "🚀" },
];
