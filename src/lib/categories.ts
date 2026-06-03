import { Film, Radio, Cpu, Smartphone, Video, User } from "lucide-react";

export type Category = {
  id: string;
  icon: typeof Film;
  name: string;
  short: string;
  description: string;
  fee: number;
  subcategories: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "content",
    icon: Film,
    name: "Content Sector",
    short: "Best Original, Regional & News Content",
    description: "Honoring channels and producers shaping India's storytelling landscape.",
    fee: 15000,
    subcategories: [
      "Best News Channel (Hindi)",
      "Best News Channel (Regional)",
      "Best Entertainment Channel",
      "Best Kids Channel",
      "Best Sports Channel",
      "Best Infotainment Channel",
      "Best Original Web Series",
    ],
  },
  {
    id: "distribution",
    icon: Radio,
    name: "Distribution Sector",
    short: "Best Cable Operator, MSO & DTH",
    description: "Celebrating last-mile excellence that brings content to every home.",
    fee: 12000,
    subcategories: [
      "Best Cable Operator (Metro)",
      "Best Cable Operator (Non-Metro)",
      "Best MSO of the Year",
      "Best DTH Service Provider",
      "Best IPTV Service",
    ],
  },
  {
    id: "technology",
    icon: Cpu,
    name: "Technology & Innovation",
    short: "Best Solution, Hardware & Breakthrough",
    description: "Recognising engineering brilliance powering the broadcasting future.",
    fee: 18000,
    subcategories: [
      "Best Technology Solution Provider",
      "Best Broadcast Equipment Manufacturer",
      "Best Innovation of the Year",
      "Best Cybersecurity Solution",
      "Best AI/ML Implementation",
    ],
  },
  {
    id: "digital",
    icon: Smartphone,
    name: "Digital Platform",
    short: "Best OTT, Streaming & App",
    description: "Saluting platforms redefining how India watches and listens.",
    fee: 15000,
    subcategories: [
      "Best OTT Platform",
      "Best Streaming Service",
      "Best Video on Demand App",
      "Best Music Streaming App",
      "Best Educational Platform",
    ],
  },
  {
    id: "creator",
    icon: Video,
    name: "Digital Creator Sector",
    short: "Best YouTuber, Podcaster & Creator",
    description: "Spotlighting voices that captivate millions across the digital sphere.",
    fee: 10000,
    subcategories: [
      "Best YouTube Channel (Entertainment)",
      "Best YouTube Channel (News)",
      "Best Podcast of the Year",
      "Best Instagram Creator",
      "Rising Star Digital Creator",
    ],
  },
  {
    id: "individual",
    icon: User,
    name: "Individual Sector",
    short: "Lifetime Achievement, CEO, Icon",
    description: "Honouring the visionaries who shape India's media destiny.",
    fee: 8000,
    subcategories: [
      "Lifetime Achievement Award",
      "CEO of the Year",
      "Industry Icon",
      "Young Achiever Award",
      "Woman Leader in Media",
    ],
  },
];

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Chandigarh","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep","Puducherry","Andaman & Nicobar",
];
