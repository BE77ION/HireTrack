require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Job = require("./models/Job");

const DEMO_EMAIL = "demo@hiretrack.com";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Pawandeep Singh";

const companies = [
  { company: "Google",       role: "SWE Intern",               status: "Offer",     salary: "₹2,00,000/mo",  location: "Bangalore",  notes: "Got the offer! Starting in June." },
  { company: "Microsoft",    role: "SDE Intern",               status: "Interview", salary: "₹1,80,000/mo",  location: "Hyderabad",  notes: "Round 3 scheduled for next week." },
  { company: "Amazon",       role: "SDE-1",                    status: "OA",        salary: "₹24 LPA",       location: "Bangalore",  notes: "OA sent, deadline in 3 days." },
  { company: "Flipkart",     role: "Backend Engineer",         status: "Applied",   salary: "₹18 LPA",       location: "Bangalore",  notes: "Applied via referral." },
  { company: "Swiggy",       role: "Frontend Engineer",        status: "Rejected",  salary: "₹16 LPA",       location: "Bangalore",  notes: "Rejected after Round 1." },
  { company: "Zomato",       role: "Full Stack Developer",     status: "Applied",   salary: "₹15 LPA",       location: "Gurgaon",    notes: "Applied through LinkedIn." },
  { company: "Razorpay",     role: "SDE Intern",               status: "Interview", salary: "₹80,000/mo",   location: "Bangalore",  notes: "Technical interview done, waiting for HR." },
  { company: "Zepto",        role: "React Developer",          status: "Applied",   salary: "₹14 LPA",       location: "Mumbai",     notes: "Applied on their careers page." },
  { company: "CRED",         role: "Product Engineer",         status: "Rejected",  salary: "₹20 LPA",       location: "Bangalore",  notes: "No feedback given." },
  { company: "Meesho",       role: "SDE-1",                    status: "OA",        salary: "₹16 LPA",       location: "Bangalore",  notes: "Completed OA, awaiting results." },
  { company: "Paytm",        role: "Backend Developer",        status: "Applied",   salary: "₹14 LPA",       location: "Noida",      notes: "Applied via Naukri." },
  { company: "PhonePe",      role: "Software Engineer",        status: "Interview", salary: "₹22 LPA",       location: "Bangalore",  notes: "Final round tomorrow!" },
  { company: "Freshworks",   role: "Associate SWE",            status: "Offer",     salary: "₹18 LPA",       location: "Chennai",    notes: "Offer received, comparing with Google." },
  { company: "Atlassian",    role: "Grad Engineer",            status: "Applied",   salary: "₹30 LPA",       location: "Remote",     notes: "Dream company, fingers crossed." },
  { company: "Uber",         role: "SWE New Grad",             status: "OA",        salary: "₹28 LPA",       location: "Bangalore",  notes: "OA in progress." },
  { company: "Nutanix",      role: "SDE Intern",               status: "Rejected",  salary: "₹60,000/mo",   location: "Pune",       notes: "Rejected post OA." },
  { company: "Postman",      role: "Frontend Engineer",        status: "Applied",   salary: "₹20 LPA",       location: "Bangalore",  notes: "Applied on their site." },
  { company: "Browserstack", role: "Software Engineer",        status: "Interview", salary: "₹22 LPA",       location: "Mumbai",     notes: "Round 2 cleared, waiting for round 3." },
  { company: "Ola",          role: "Full Stack Developer",     status: "Applied",   salary: "₹17 LPA",       location: "Bangalore",  notes: "Applied through Unstop." },
  { company: "InMobi",       role: "SDE-1",                    status: "Rejected",  salary: "₹16 LPA",       location: "Bangalore",  notes: "Ghosted after interview." },
];

function randomPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Remove old demo data
  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) {
    await Job.deleteMany({ user: existing._id });
    await User.deleteOne({ _id: existing._id });
    console.log("🗑️  Cleared old demo data");
  }

  // Create demo user
  const user = await User.create({ name: DEMO_NAME, email: DEMO_EMAIL, password: DEMO_PASSWORD });
  console.log(`👤 Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  // Insert jobs
  const jobs = companies.map((j, i) => ({
    ...j,
    user: user._id,
    appliedDate: randomPastDate(i * 2 + 1),
    createdAt: randomPastDate(i * 2 + 1),
  }));

  await Job.insertMany(jobs);
  console.log(`📋 Inserted ${jobs.length} jobs`);

  console.log("\n🎉 Done! Login with:");
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
