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
    "2) Not Set",
    "1) Reassign",
    "1) DB Nuture", 
    "1) Low",
    "0) Nil",
    "0) Avoid"
  ],
  
  leadProgression: [
    "0) No Contact",
    "1) Contact Initiated",
    "2) Initial Discussion",
    "3) Inv Consultation",
    "6) Client",
    "3) Ex-Client",
    "4) Deal Indicated",
    "5) Documentation"
  ],
  
  wealthLevel: [
    "0) Unknown",
    "0) Retail",
    "1) Wealth",
    "2) Affluent",
    "3) HNI",
    "4) Ultra-HNI",
    "0) NA"
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
  primaryRm: [
    "Ankita Singh",
    "Aravind Kodipaka",
    "Ashi Anand",
    "Deepak Jayakumar",
    "IME Investor Desk",
    "Maneesh Gupta",
    "Srini P",
    "Paresh Vaish",
    "Chittaranjan",
    "Preethy Uthup"
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
    "Performance as of: 30-Oct-25 (returns >1yr are annualised returns). Returns are pre-tax returns, post all fees & expenses. Global fund returns are in USD or in the funds currency"
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
    { id: 7, name: "lead" },
    { id: 8, name: "trial_ended" },
    { id: 9, name: "ban" }, 
    { id: 12, name: "not_validated" }
  ]
} as const;

// Type definitions for TypeScript support
export type MasterOptions = typeof MASTER_OPTIONS;
export type MasterOptionKey = keyof MasterOptions;
export type MasterOptionValue<T extends MasterOptionKey> = MasterOptions[T][number];