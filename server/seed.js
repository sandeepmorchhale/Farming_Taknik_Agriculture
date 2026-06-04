const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Contact = require('./models/Contact');

dotenv.config();

const coursesData = [
  {
    title: 'Capsicum Cultivation Masterclass',
    subtitle: 'शिमला मिर्च की वैज्ञानिक खेती - Learn nursery preparation, greenhouse setup, and pest management.',
    description: 'A comprehensive masterclass on growing Capsicum (Shimla Mirch) successfully. Covers greenhouse vs. open field cultivation, drip irrigation, fertilizer management, disease prevention, and high-profit sales strategies.',
    category: 'Vegetable Crops',
    thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80',
    price: 1299,
    originalPrice: 2999,
    duration: '8+ Hours',
    features: ['Ashish Morchhale (Expert Guide)', '8+ Hours of Content', 'Greenhouse & Open Field Layouts', 'Fertigation Schedules', 'Lifetime Access'],
    modules: [
      {
        title: 'Module 1: Introduction & Nursery Setup',
        lessons: [
          {
            title: '1.1 Capsicum Farming Overview & Profit Analysis',
            duration: '12:15',
            videoUrl: 'https://www.youtube.com/embed/KzD71h_520o',
            summary: 'Understanding crop timelines, climate suitability, and budgeting for Capsicum in India.'
          },
          {
            title: '1.2 Raising Healthy Seedlings in Pro-trays',
            duration: '15:20',
            videoUrl: 'https://www.youtube.com/embed/f9vT8d9Bv2k',
            summary: 'Sowing seeds in cocopeat, moisture control, and nursery shield techniques.'
          }
        ]
      },
      {
        title: 'Module 2: Field Management & Harvest',
        lessons: [
          {
            title: '2.1 Bed Preparation, Drip Line & Mulching',
            duration: '18:30',
            videoUrl: 'https://www.youtube.com/embed/J6iP6Jm9oJk',
            summary: 'Bed spacing, laying mulching sheets, and installing dual drip line systems.'
          },
          {
            title: '2.2 Pest Management & Disease Control',
            duration: '20:10',
            videoUrl: 'https://www.youtube.com/embed/KzD71h_520o',
            summary: 'Identifying whiteflies, mites, and applying biological vs chemical solutions.'
          }
        ]
      }
    ]
  },
  {
    title: 'Tomato Cultivation Masterclass',
    subtitle: 'टमाटर की वैज्ञानिक खेती - Master high-yield tomato farming from seed to APMC mandi.',
    description: 'Grow high-demand commercial tomatoes profitably. This course features field tutorials on bamboo stacking, drip line irrigation, fertilizer schedules, and chemical dosing to prevent Leaf Curl Virus and blights.',
    category: 'Vegetable Crops',
    thumbnail: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80',
    price: 999,
    originalPrice: 2499,
    duration: '7+ Hours',
    features: ['Beginner Friendly', 'Leaf Curl Virus Controls', 'Stacking & Mulching Diagrams', '20+ Crop Handouts', 'Lifetime Access'],
    modules: [
      {
        title: 'Module 1: Tomato Nursery & Setup',
        lessons: [
          {
            title: '1.1 Selecting Top Tomato Hybrids & Sowing',
            duration: '14:35',
            videoUrl: 'https://www.youtube.com/embed/J6iP6Jm9oJk',
            summary: 'Comparing yield, resistance, and market rates of top hybrid tomato seeds.'
          },
          {
            title: '1.2 Bamboo & Wire Stacking (स्टैकिंग विधि)',
            duration: '16:45',
            videoUrl: 'https://www.youtube.com/embed/f9vT8d9Bv2k',
            summary: 'How to support tomato plants with bamboo poles and wire strings for premium fruit quality.'
          }
        ]
      },
      {
        title: 'Module 2: Disease Control & Market Sales',
        lessons: [
          {
            title: '2.1 Fungal Diseases & Pest Sprays',
            duration: '22:15',
            videoUrl: 'https://www.youtube.com/embed/KzD71h_520o',
            summary: 'Treating early blight, late blight, and controlling fruit borers.'
          },
          {
            title: '2.2 Harvesting & Negotiating Mandi Prices',
            duration: '18:50',
            videoUrl: 'https://www.youtube.com/embed/J6iP6Jm9oJk',
            summary: 'Grading tomatoes, shelf-life extensions, and selling directly at top prices.'
          }
        ]
      }
    ]
  },
  {
    title: 'Start a Farming Business Masterclass',
    subtitle: 'खेती को व्यापार कैसे बनाएं - Master seasonal planning, APMC networks, and crop profit calculators.',
    description: 'Transform your traditional farm into a highly profitable modern business. Ashish Morchhale details how to analyze seasonal price trends, calculate exact per-acre cost-to-profit ratios, secure government subsidies, and negotiate with buyers.',
    category: 'Agri-Business Management',
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    price: 1499,
    originalPrice: 3499,
    duration: '6+ Hours',
    features: ['Business Profit Calculators', 'Seasonal Planting Schedules', 'Subsidy Schemes Guides', 'APMC Mandi Directory', 'Certificate of Completion'],
    modules: [
      {
        title: 'Module 1: Business Operations & Crop Cycles',
        lessons: [
          {
            title: '1.1 Seasonal Planning & Crop Selection',
            duration: '15:40',
            videoUrl: 'https://www.youtube.com/embed/f9vT8d9Bv2k',
            summary: 'Evaluating water availability and choosing fast-growing, high-demand crops.'
          },
          {
            title: '1.2 Cost-to-Profit Calculator for 1 Acre',
            duration: '18:50',
            videoUrl: 'https://www.youtube.com/embed/J6iP6Jm9oJk',
            summary: 'Calculating overheads: seeds, fertilizer, labor, and machine costs.'
          }
        ]
      },
      {
        title: 'Module 2: Funding & Subsidies',
        lessons: [
          {
            title: '2.1 Government Subsidies & Schemes',
            duration: '22:30',
            videoUrl: 'https://www.youtube.com/embed/KzD71h_520o',
            summary: 'Registering for polyhouse setup subsidies, micro-irrigation, and seed bank resources.'
          },
          {
            title: '2.2 Bank Agriculture Loans & KCC Process',
            duration: '20:15',
            videoUrl: 'https://www.youtube.com/embed/f9vT8d9Bv2k',
            summary: 'Navigating Kisan Credit Cards, bank application requirements, and crop insurance.'
          }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farming_taknik');
    console.log(`Connected to Database for seeding: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Contact.deleteMany();
    console.log('Cleared existing collections.');

    // Seed Courses
    const courses = await Course.insertMany(coursesData);
    console.log(`Seeded ${courses.length} authentic courses successfully.`);

    // Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@farmingtaknik.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const adminUser = new User({
      name: 'Ashish Morchhale (Farming Taknik Admin)',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    await adminUser.save();
    console.log(`Seeded Admin User: ${adminEmail} / [PROTECTED_PASSWORD]`);

    // Create Student User
    const studentUser = new User({
      name: 'Sandeep Kumar',
      email: 'student@gmail.com',
      password: 'studentpassword123',
      role: 'student',
    });
    await studentUser.save();
    console.log('Seeded Student User: student@gmail.com / studentpassword123');

    // Enroll student in Capsicum Cultivation by default
    const capsicumCourse = courses.find(c => c.title.includes('Capsicum'));
    if (capsicumCourse) {
      const firstLessonId = capsicumCourse.modules[0].lessons[0]._id.toString();
      await Enrollment.create({
        user: studentUser._id,
        course: capsicumCourse._id,
        completedLessons: [firstLessonId],
      });
      console.log(`Enrolled Sandeep in ${capsicumCourse.title} with default progress.`);
    }

    // Seed contact inquiries mapping YouTube questions
    await Contact.insertMany([
      {
        name: 'Ramesh Patel',
        email: 'ramesh.patel@gmail.com',
        message: 'Namaskar Ashish ji, I watched your Capsicum video. In Gujarat soil, can we transplant the seedlings in June-July, and does the course cover soil nutrition?'
      },
      {
        name: 'Gopal Mandloi',
        email: 'gopal.mandloi@yahoo.com',
        message: 'Hello, I bought the Chilli Cultivation course. It is very detailed! Can you share the spray schedule for whiteflies?'
      }
    ]);
    console.log('Seeded sample contact inquiries.');

    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
