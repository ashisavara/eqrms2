// Master options data - static reference for all form fields and table filters
// Update this file and deploy to refresh options across the entire application
export const MASTER_OPTIONS = {
  // Lead Management
  leadSource: [
    "0) Unknown",
    "0) Database", 
    "1) Digital Ads",
    "1) LinkedIn",
    "2) IME Academy",
    "3) Client Referral",
    "3) Partner Referral",
    "2) IME Website",
    "4) Ashi Contacts",
    "4) RM Contacts",
  ],
  
  importance: [
    "4) Urgent",
    "3) High",
    "2) Medium",
    "1) Low",
    "1) Telecaller",
    "1) DB Nuture", 
    "0) Avoid",
    "2) Not Set"
  ],
  
  leadProgression: [
    "0) No Contact",
    "1) Contact Initiated",
    "2) Initial Discussion",
    "3) Inv Consultation",
    "3) Ex-Client",
    "4) Deal Indicated",
    "5) Documentation",
    "6) Client"
  ],
  
  wealthLevel: [
    "0) NA",
    "0) Unknown",
    "0) Retail",
    "1) Wealth",
    "2) Affluent",
    "3) HNI",
    "4) Ultra-HNI"
  ],
  
  leadType: [
    "Lead",
    "NRI",
    "Foreigner",
    "Non-Individual",
    "IME RM",
    "Referral Partner",
    "Distributor"
  ],

  // Deal Management
  dealStage: [
    "0) Lost",
    "1) Cold",
    "2) Indicated",
    "3) Likely",
    "4) Confirmed",
    "5) Documentation",
    "6) Execution",
    "7) Won"
  ],
  
  dealSegment: [
    "FB",
    "3rd Party PMS",
    "IME Equity PMS",
    "IME Wealth PMS",
    "Kristal",
    "Advisory",
    "Others"
  ],
  
  dealEstClosure: [
    "Current Month",
    "Next Month",
    "Within 3m",
    "Within 6m",
    "After 6m",
    "Better Markets",
    "Awaiting Funds"
  ],
  
  dealLikelihoodOptions: [
    "1.0",
    "0.8",
    "0.6",
    "0.4",
    "0.2",
    "0.0"
  ],

  // Mandate & Portfolio Tags
  otherMandateTags: [
    "Open to Complex Pdts",
    "Open to Boutique Managers",
    "Open to LockedIn Funds"
  ],

  // RMS & Research Tags
  rmsTagSegment: [
    "Strategy",
    "Philosophy",
    "Additional Tags"
  ],
  
  rmsTagCategory: [
    "amc",
    "scheme",
    "category",
    "assetclass"
  ],
  
  rmsAmcTagSegment: [
    "AMC Pedigree",
    "Philosophy",
    "Add Philosophy",
    "Team"
  ],
  
  rmsUpdateLogType: [
    "AMC Rating Change",
    "Fund Rating Change",
    "New AMC",
    "New Fund",
    "Team Change",
    "View Change",
    "Other Salient Point"
  ],

  // Team & Responsibility
  // primaryRm is now value-label pairs: UUID (value) maps to name (label)
  // The UUID is saved to Supabase, while the name is displayed in the dropdown
  primaryRm: [
    { value: "892c7542-3416-45da-bda4-719d6e302f9a", label: "Deepak Jayakumar" },
    { value: "5c2c3fef-095b-4e50-8125-2824bc4aefa4", label: "Maneesh Gupta" },
    { value: "7c4976f8-ae7d-4843-b98b-4d58d409f732", label: "Srini P" },
    { value: "d096fae3-6fd4-4294-8f3f-f1d13f7720e6", label: "Paresh Vaish" },
    { value: "53ed22d1-c0fe-4978-9df4-72f3a934cc0a", label: "Ankita Singh" },
    { value: "bceeb088-265d-434c-870a-c2752e60ef47", label: "Ashi Anand" },
    { value: "44db20a2-71de-41ae-ac72-36612d96235f", label: "Aravind Kodipaka" },
    { value: "ad0a0c17-21f4-4d2f-b87d-b9534c22a205", label: "Chittaranjan" },
    { value: "8b4d186e-6ab3-43ae-b719-034f6ea50f82", label: "Manisha Ravindran" },
    { value: "bccf827f-03c9-4472-94cb-bc4ee094463f", label: "Shagun Luthra" },
    { value: "7b679d91-fea4-4dca-b6b6-ba513529af07", label: "Ananya Bhadauria" },
  ] as const,

  primaryResonsibility: [
    "Pvt Banker",
    "Service RM",
  ],
  
  issueResponsibility: [
    "Hritwik",
    "Neel",
    "Aravind",
    "Ashi"
  ],
  
  department: [
    "Ops",
    "Investor Desk",
    "Research"
  ],

  // AMC Assessment Tags
  amcTeamPedigreeTag: [
    "Star FM",
    "High Pedigree",
    "Seasoned Team",
    "Specialist",
    "Moderate Pedigree",
    "Lack of Team Depth",
    "Unproven Team Credentials",
    "Limited FM Experience",
    "Recent Team Churn"
  ],
  
  amcInvPhilosophyDefTag: [
    "Strongly Defined & Followed",
    "Strongly Defined",
    "Generic Philosophy",
    "Flexible Philosphy",
    "Well Defined",
    "Loosely Defined"
  ],
  
  amcMaturityTag: [
    "Highly Seasoned (10+ yrs)",
    "Matured (5-10 yrs)",
    "New AMC (3-5 yrs)",
    "Nascent AMC (<3 yrs)"
  ],
  
  amcTeamChurnTag: [
    "Nil (FM-Founder)",
    "Low (Depth in team)",
    "Low (Large ESOP)",
    "Moderate (AMC-driven)",
    "High (Risk of churn)",
    "V High (FM-dependence)"
  ],
  
  amcPedigreeTag: [
    "Industry Leader",
    "Large Global AMC",
    "Highly Pedigreed",
    "Established Niche AMC",
    "Boutique AMC",
    "Building Strong Pedigree",
    "Established AMC",
    "Niche AMC",
    "Financial Institution",
    "Regional Expertise",
    "Broker_Led AMC",
    "Wealth Mgmt-Led AMC",
    "Credible Niche",
    "FPI Focused",
    "Strong Alternative Credentials",
    "Developing Credentials",
    "FM-Led Emerging AMC",
    "Niche Early Stage AMC",
    "Nascent AMC",
    "Sub-Scale AMC",
    "Limited AMC Pedigree",
    "Tier-2 MF",
    "Tier-3 MF",
    "Captive AMC",
    "Limited Public Info",
    "Under Review"
  ],

  // Fund Assessment
  fundStrategyDefTag: [
    "Strongly Defined & Followed",
    "Strongly Defined",
    "Generic Philosophy",
    "Flexible Philosphy",
    "Well Defined",
    "Loosely Defined"
  ],
  
  fundPerformanceAsOf: [
    "Performance as of: 31-Dec-25 (returns >1yr are annualised returns). Returns are pre-tax returns, post all fees & expenses (some AIF returns are post-tax). Global fund returns are in USD or in the funds currency"
  ],
  
  openForSubscriptionTag: [
    "Direct",
    "Y",
    "N",
    "Only SIP"
  ],

  // Investment & Analysis
  invRecommendation: [
    "Exit",
    "Reduce",
    "Not Recommended Fund",
    "Not Recommended AMC",
    "Tax Inefficient",
    "Not in Mandate",
    "Increase",
    "New Fund"
  ],
  
  coverageTags: [
    "Focus",
    "Detail",
    "Basic",
    "Brief",
    "Exclude"
  ],
  
  companyQualityTags: [
    "V High",
    "High",
    "Medium",
    "Low",
    "V Low"
  ],
  
  resultRating: [
    "Above",
    "Below",
    "Inline",
    "Mixed"
  ],

  // Operations & Support
  ticketUrgency: [
    "Urgent",
    "High",
    "Medium",
    "Low"
  ],
  
  ticketStatus: [
    "Not Started",
    "In Progress",
    "Asked Clarifications",
    "Waiting on Client",
    "Closed"
  ],

  // Interactions & Communication
  interactionType: [
    "Meeting",
    "Interaction",
    "Follow up"
  ],
  
  interactionTag: [
    "0) Not Interested",
    "0) Not Suitable",
    "0) Wrong Number",
    "1) Cut Call",
    "1) No Answer",
    "1) Switched Off",
    "2) Call Later",
    "2) Follow-up Call",
    "3) Pitched",
    "4) Consultation Booked"
  ],
  
  interactionChannelTag: [
    "WA",
    "Email",
    "Phone",
    "LinkedIn",
    "In-person",
    "Others",
    "Zoom"
  ],

  // Rating Systems
  ratingNumber: [
    "1.0",
    "2.0",
    "3.0",
    "4.0",
    "5.0",
    "0.0"
  ],

  // Risk Profile Options
  riskProfile: [
    "Very Aggressive",
    "Aggressive", 
    "Balanced",
    "Conservative",
    "Very Conservative"
  ],

  // User Role Options
  userRoles: [
    { id: 6, name: "client" },
    { id: 7, name: "trial" },
    { id: 8, name: "trial_ended" },
    { id: 9, name: "ban" }, 
    { id: 12, name: "not_validated" }
  ],

  // Blog Status
  blogStatus: [
    "Draft",
    "Published",
    "Archived",
    "RMS Only"
  ],

  // Blog Category
  blogCategory: [
    "Equity",
    "Debt",
    "Hybrid Funds",
    "Financial Advice",
    "PMS AIF",
    "International",
    "Recommendations", 
    "Alternatives",
    "IME",
    "Real Estate"
  ],

  // Media Publications
  media: [
    "Economic Times",
    "ET Now",
    "Moneycontrol",
    "CNBC-TV18",
    "The Ken",
    "Business Today",
    "Fortune India",
  ], 

  financialProductsInvestedIn: ["FD","Bonds","MF","PMS","AIF","Global","Real Estate","Insurance"],

  netWorth: ["0-50 lakhs","50 lakhs - 2 cr","2 - 10 cr",">10 cr"],

  hearImeCapital: ["IME Employee","IME Client","FB/Instagram","LinkedIn","YouTube","IME Website","Others"],

  investmentQuery:[
    "International","Fixed Income","NRI","Equity","Fixed Income","Alternatives","Unlisted","IME","Advice"
  ],

  // Academy Lesson
  lessonDifficulty: ["Beginner","Intermediate","Advanced"],

  course: [
    "Financial Planning",
    "Investment Mandate",],
} as const;

// Type definitions for TypeScript support
export type MasterOptions = typeof MASTER_OPTIONS;
export type MasterOptionKey = keyof MasterOptions;
export type MasterOptionValue<T extends MasterOptionKey> = MasterOptions[T][number];