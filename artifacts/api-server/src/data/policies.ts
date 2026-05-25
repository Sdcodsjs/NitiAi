export interface PolicyChunk {
  id: string;
  schemeName: string;
  sector: string;
  ministry: string;
  tags: string[];
  description: string;
  eligibility: string;
  benefits: string;
  applicationProcess: string;
  source: string;
  keywords: string[];
}

export const POLICY_KNOWLEDGE_BASE: PolicyChunk[] = [
  {
    id: "pm-kisan",
    schemeName: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    sector: "agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["farmer", "agriculture", "income support", "subsidy", "rural"],
    description:
      "PM-KISAN provides income support of Rs. 6,000 per year to all land-holding farmer families having cultivable land, regardless of the size of their land holdings. The amount is paid in three equal installments of Rs. 2,000 each, directly into the bank accounts of the beneficiaries.",
    eligibility:
      "All land-holding farmer families with cultivable agricultural land. Excludes institutional land holders; farmer families holding constitutional posts; present and former holders of ministerial posts; current and former Members of Lok Sabha, Rajya Sabha, State Legislative Assemblies; income taxpayers (last assessment year); professionals like doctors, engineers, lawyers, chartered accountants, and architects registered with professional bodies.",
    benefits:
      "Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000 each directly transferred to the bank account of the beneficiary farmers. Helps meet the expenses related to agricultural inputs, crop health and other needs.",
    applicationProcess:
      "Farmers can register through the PM-KISAN portal (pmkisan.gov.in), through Common Service Centres (CSC), or through their local Patwari/Revenue Officer. Aadhaar card is mandatory. Documents required: Aadhaar, bank passbook, land records.",
    source: "https://pmkisan.gov.in",
    keywords: [
      "pm kisan", "kisan", "farmer income support", "6000", "agriculture subsidy",
      "pradhan mantri kisan", "किसान", "crop", "agricultural income",
    ],
  },
  {
    id: "ayushman-bharat",
    schemeName: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    sector: "health",
    ministry: "Ministry of Health and Family Welfare",
    tags: ["health", "insurance", "hospital", "medical", "poor", "BPL"],
    description:
      "Ayushman Bharat PM-JAY is the world's largest health insurance/assurance scheme. It provides health coverage of up to Rs. 5 lakh per family per year for secondary and tertiary hospitalization. It covers over 10 crore poor and vulnerable families (approximately 50 crore beneficiaries).",
    eligibility:
      "Families identified based on SECC 2011 data. Includes Scheduled Castes and Scheduled Tribes, families without shelter, destitute families, families with daily wage laborers, construction workers, sanitation workers, beggars. Automatically includes active RSBY beneficiaries. No cap on family size or age.",
    benefits:
      "Health coverage up to Rs. 5 lakh per family per year for secondary and tertiary hospitalization. Covers pre- and post-hospitalization expenses. Covers 1,949 medical and surgical packages. Cashless and paperless access at empanelled public and private hospitals across India. Transport allowance also provided.",
    applicationProcess:
      "Beneficiaries can visit any empanelled hospital and use Aadhaar card, ration card, or other government-issued ID. Hospitals have Ayushman Mitra to assist with the process. Check eligibility at mera.pmjay.gov.in or call 14555.",
    source: "https://pmjay.gov.in",
    keywords: [
      "ayushman bharat", "health insurance", "pm jay", "pmjay", "5 lakh", "hospital",
      "health coverage", "jan arogya", "medical", "hospitalization", "health scheme",
    ],
  },
  {
    id: "pm-awas-gramin",
    schemeName: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    sector: "housing",
    ministry: "Ministry of Rural Development",
    tags: ["housing", "rural", "shelter", "BPL", "construction"],
    description:
      "PMAY-G aims to provide a pucca house with basic amenities to all houseless and those living in kutcha and dilapidated houses in rural areas by 2024. The scheme provides financial assistance to construct houses.",
    eligibility:
      "Houseless rural families and those living in kutcha or dilapidated structures. Prioritization based on SECC 2011 data: households with no room or kutcha walls/roof; households with no adult member between 16-59 years; female headed households with no adult male member between 16-59 years; households with disabled member and no able-bodied adult member; SC/ST; families with bonded labourers.",
    benefits:
      "Financial assistance of Rs. 1.20 lakh in plain areas and Rs. 1.30 lakh in hilly/difficult areas and IAP districts per unit. Additional Rs. 12,000 for construction of toilet under SBM-G. Rs. 18,000 for 90/95 days unskilled labour under MGNREGS. Loan of up to Rs. 70,000 from financial institutions.",
    applicationProcess:
      "Beneficiary selection done through Gram Sabha from SECC 2011 permanent wait list. Applications at Gram Panchayat or Common Service Centre. Documents: Aadhaar, bank account details, land ownership proof.",
    source: "https://pmayg.nic.in",
    keywords: [
      "pm awas", "housing scheme", "gramin", "rural housing", "pucca house", "pmay",
      "house construction", "kutcha house", "1.2 lakh", "shelter",
    ],
  },
  {
    id: "pm-awas-urban",
    schemeName: "Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
    sector: "housing",
    ministry: "Ministry of Housing and Urban Affairs",
    tags: ["housing", "urban", "EWS", "LIG", "interest subsidy"],
    description:
      "PMAY-U addresses the urban housing shortage among EWS/LIG and MIG categories. It provides credit-linked subsidy to promote affordable housing in urban areas across India.",
    eligibility:
      "EWS (household income up to Rs. 3 lakh/year), LIG (Rs. 3-6 lakh/year), MIG-I (Rs. 6-12 lakh/year), MIG-II (Rs. 12-18 lakh/year). Beneficiary family should not own a pucca house in any part of India. Female head of household or co-applicant is preferred.",
    benefits:
      "Credit Linked Subsidy Scheme (CLSS): EWS/LIG get 6.5% interest subsidy on loans up to Rs. 6 lakh. MIG-I gets 4% subsidy on loans up to Rs. 9 lakh. MIG-II gets 3% subsidy on loans up to Rs. 12 lakh. In-situ slum rehabilitation and affordable housing in partnership components also available.",
    applicationProcess:
      "Apply through PMAY Urban portal (pmaymis.gov.in), banks, housing finance companies, or Common Service Centres. Required documents: Aadhaar, income proof, property documents, bank statements.",
    source: "https://pmaymis.gov.in",
    keywords: [
      "pmay urban", "urban housing", "interest subsidy", "EWS", "LIG", "MIG",
      "credit linked subsidy", "affordable housing", "home loan subsidy",
    ],
  },
  {
    id: "pm-mudra-yojana",
    schemeName: "Pradhan Mantri MUDRA Yojana (PMMY)",
    sector: "entrepreneurship",
    ministry: "Ministry of Finance",
    tags: ["loan", "entrepreneur", "business", "MSME", "self-employment", "startup"],
    description:
      "MUDRA (Micro Units Development and Refinance Agency) provides loans to non-farm income generating activities in manufacturing, trading and services sectors. Loans are provided through commercial banks, RRBs, co-operative banks, and MFIs.",
    eligibility:
      "Any Indian citizen who has a business plan for a non-farm income generating activity in manufacturing, processing, trading, or service sector and whose credit need is less than Rs. 10 lakh. No minimum age restriction. No collateral required for Shishu and Kishore loans.",
    benefits:
      "Three categories: Shishu (loans up to Rs. 50,000), Kishore (Rs. 50,000 to Rs. 5 lakh), Tarun (Rs. 5 lakh to Rs. 10 lakh). No processing fee for Shishu. MUDRA card (RuPay debit card) for working capital needs. Repayment period up to 5 years.",
    applicationProcess:
      "Apply at any PSU bank, regional rural bank, cooperative bank, MFI, or NBFC. Documents required: ID proof, address proof, business plan/activity details, bank statements, quotations for machinery/equipment.",
    source: "https://mudra.org.in",
    keywords: [
      "mudra", "business loan", "small business", "shishu", "kishore", "tarun",
      "micro loan", "entrepreneur", "self employment", "startup loan", "MSME",
    ],
  },
  {
    id: "pm-scholarship",
    schemeName: "Prime Minister's Scholarship Scheme (PMSS)",
    sector: "education",
    ministry: "Ministry of Home Affairs",
    tags: ["scholarship", "student", "education", "central armed police", "ex-servicemen"],
    description:
      "PMSS encourages technical and post-graduate education for children and widows of ex-servicemen and ex-Coast Guard personnel. The scheme supports professional degree courses recognized by statutory regulatory bodies.",
    eligibility:
      "Children and widows of Ex-Servicemen/Ex-Coast Guard personnel. Minimum 60% marks in 10+2/Diploma/Graduation. Age between 18-25 years. Applicable for professional degree courses like BE/B.Tech, BDS, MBBS, BEd, BBA, BCA, B.Sc (Nursing), MBA, MCA.",
    benefits:
      "Boys: Rs. 2,500 per month. Girls: Rs. 3,000 per month. Duration: as per course duration. Scholarship is renewable each year based on performance.",
    applicationProcess:
      "Apply online at Kendriya Sainik Board website (ksb.gov.in) or National Scholarship Portal (scholarships.gov.in). Required: Mark sheets, bonafide certificate from institution, bank details, service certificate of sponsor.",
    source: "https://ksb.gov.in",
    keywords: [
      "PM scholarship", "scholarship", "student", "education grant", "ex-servicemen",
      "defence scholarship", "technical education", "engineering scholarship",
    ],
  },
  {
    id: "nsp-scholarships",
    schemeName: "National Scholarship Portal (NSP) - Central Sector Scheme",
    sector: "education",
    ministry: "Ministry of Education",
    tags: ["scholarship", "student", "meritorious", "OBC", "SC", "ST", "minority"],
    description:
      "The National Scholarship Portal is a one-stop platform for students to apply for various central and state government scholarships. Includes scholarships for SC, ST, OBC, minority communities, and merit-based awards.",
    eligibility:
      "Central Sector Scholarship: 12th standard passed with minimum 80 percentile. Family income below Rs. 8 lakh per annum. Must be in regular, full-time undergraduate or postgraduate course. Pre-Matric: 9th and 10th class students from SC/ST/Minority communities. Post-Matric: 11th to PhD level students.",
    benefits:
      "Central Sector Scholarship: Rs. 10,000-20,000 per annum for undergraduate, Rs. 20,000 for postgraduate. Pre-Matric: Rs. 150-750 per month. Post-Matric: Varies by course and category (up to Rs. 82,000 per annum for professional courses).",
    applicationProcess:
      "Register on National Scholarship Portal (scholarships.gov.in). Upload required documents: 10th/12th marksheet, income certificate, caste certificate, institution verification. Banks must be linked for direct benefit transfer.",
    source: "https://scholarships.gov.in",
    keywords: [
      "national scholarship", "NSP", "scholarship portal", "student scholarship",
      "SC scholarship", "ST scholarship", "minority scholarship", "OBC scholarship",
      "education scholarship", "merit scholarship",
    ],
  },
  {
    id: "pm-fasal-bima",
    schemeName: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    sector: "agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["crop insurance", "farmer", "agriculture", "natural disaster", "weather"],
    description:
      "PMFBY provides financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests and diseases. It is a fully-fledged insurance coverage for pre-sowing to post-harvest losses.",
    eligibility:
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas. Loanee farmers: compulsory enrollment. Non-loanee farmers: voluntary. Must have insurable interest in the crop.",
    benefits:
      "Premium: Kharif crops - 2% of sum insured; Rabi crops - 1.5%; commercial/horticultural crops - 5%. Government subsidizes remaining premium. Coverage for: yield loss, prevented sowing, post-harvest losses, localized calamities. Technology-based crop yield assessment.",
    applicationProcess:
      "Loanee farmers: enrolled through banks. Non-loanee farmers: apply through Common Service Centres, banks, or online at pmfby.gov.in. Documents: Aadhaar, land records, bank account, sowing certificate.",
    source: "https://pmfby.gov.in",
    keywords: [
      "fasal bima", "crop insurance", "PMFBY", "farmer insurance", "kharif",
      "rabi", "natural calamity", "crop damage", "agricultural insurance",
    ],
  },
  {
    id: "swachh-bharat",
    schemeName: "Swachh Bharat Mission (SBM)",
    sector: "sanitation",
    ministry: "Ministry of Jal Shakti",
    tags: ["sanitation", "toilet", "rural", "ODF", "cleanliness"],
    description:
      "Swachh Bharat Mission aims to achieve a 'Clean India' by constructing household toilets and promoting safe sanitation practices. The Gramin component targets open defecation free villages while the Urban component targets urban sanitation.",
    eligibility:
      "Rural: All households without toilets. Priority to Below Poverty Line (BPL) families, SC/ST families, small and marginal farmers, landless labourers with homestead, physically handicapped persons, and women-headed households. Urban: Urban Local Bodies for community/public toilets.",
    benefits:
      "Incentive of Rs. 12,000 for construction of individual household toilets (Rs. 10,800 from GoI, Rs. 1,200 from State). Solid waste management grants to Urban Local Bodies. Community awareness and behavior change communication support.",
    applicationProcess:
      "Apply at Gram Panchayat or online at sbm.gov.in. State government channels the funds through Gram Panchayat. Documents: Aadhaar, bank account details, land ownership proof.",
    source: "https://sbm.gov.in",
    keywords: [
      "swachh bharat", "toilet", "sanitation", "ODF", "open defecation free",
      "clean india", "SBM", "toilet construction", "12000 toilet",
    ],
  },
  {
    id: "atal-pension-yojana",
    schemeName: "Atal Pension Yojana (APY)",
    sector: "social security",
    ministry: "Ministry of Finance",
    tags: ["pension", "retirement", "unorganized sector", "social security"],
    description:
      "APY is a government-backed pension scheme focused on workers in the unorganized sector. It guarantees a minimum monthly pension of Rs. 1,000 to Rs. 5,000 at the age of 60, depending on contributions.",
    eligibility:
      "Any Indian citizen between 18-40 years of age. Must have a savings bank account. Not an income taxpayer. Primarily targeted at workers in unorganized sector. NRIs are not eligible.",
    benefits:
      "Guaranteed minimum monthly pension of Rs. 1,000, 2,000, 3,000, 4,000, or 5,000 at age 60. On subscriber's death, spouse receives the same pension; after spouse's death, accumulated pension wealth returned to nominee. Government co-contribution of 50% or Rs. 1,000 per year (whichever is lower) for eligible subscribers.",
    applicationProcess:
      "Open APY account at any bank or post office. Can also apply through net banking. Documents: Aadhaar, mobile number linked to Aadhaar, savings bank account. Monthly contribution deducted automatically.",
    source: "https://npscra.nsdl.co.in",
    keywords: [
      "atal pension", "APY", "pension scheme", "retirement", "unorganized sector",
      "1000 pension", "5000 pension", "monthly pension", "old age security",
    ],
  },
  {
    id: "jan-dhan",
    schemeName: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    sector: "financial inclusion",
    ministry: "Ministry of Finance",
    tags: ["bank account", "financial inclusion", "zero balance", "DBT", "insurance"],
    description:
      "PMJDY is a national mission for financial inclusion to ensure access to financial services to all households. It offers basic savings bank account with no minimum balance, RuPay debit card, and accident insurance coverage.",
    eligibility:
      "Any Indian citizen, including minors (operated by guardian). No minimum balance required. Unbanked individuals in both rural and urban areas. Documents needed are minimal — self-certification acceptable if ID not available.",
    benefits:
      "Zero balance savings account. RuPay debit card with Rs. 1 lakh accident insurance (Rs. 2 lakh for new accounts). Rs. 10,000 overdraft facility after satisfactory operation for 6 months. Direct benefit transfer of government subsidies. Life insurance of Rs. 30,000 for eligible subscribers.",
    applicationProcess:
      "Visit any bank branch or business correspondent. Documents: Aadhaar card or any government-issued ID. No minimum deposit required to open account. Account can be opened with zero balance.",
    source: "https://pmjdy.gov.in",
    keywords: [
      "jan dhan", "PMJDY", "bank account", "zero balance", "financial inclusion",
      "rupay card", "overdraft", "DBT", "direct benefit transfer",
    ],
  },
  {
    id: "skill-india",
    schemeName: "Skill India Mission - PMKVY",
    sector: "skill development",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    tags: ["skill", "training", "youth", "employment", "vocational", "certification"],
    description:
      "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) enables Indian youth to take industry-relevant skill training that will help them to secure a better livelihood. Training is imparted by affiliated Training Partners at Training Centres.",
    eligibility:
      "Indian nationals between 15-45 years. School/college dropouts, unemployed youth, and underemployed workers are prioritized. No prior qualification needed for most courses. Differently-abled persons are encouraged.",
    benefits:
      "Free short-term skill training (150-300 hours). Certification by National Skill Development Corporation (NSDC) or Sector Skill Councils. Monetary reward upon certification (Rs. 500-10,000 depending on course). Job placement assistance through NSDC network. Recognition of Prior Learning (RPL) for existing skills.",
    applicationProcess:
      "Register online at skillindiadigital.gov.in or visit nearest PMKVY Training Centre. Documents: Aadhaar card, educational certificates, bank account for monetary reward. Find nearest training centre on the portal.",
    source: "https://skillindiadigital.gov.in",
    keywords: [
      "skill india", "PMKVY", "vocational training", "skill training", "youth",
      "job training", "certification", "kaushal vikas", "employment training",
    ],
  },
  {
    id: "standup-india",
    schemeName: "Stand-Up India Scheme",
    sector: "entrepreneurship",
    ministry: "Ministry of Finance",
    tags: ["loan", "SC", "ST", "woman entrepreneur", "business", "greenfield"],
    description:
      "Stand-Up India facilitates bank loans between Rs. 10 lakh to Rs. 1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    eligibility:
      "SC/ST and/or women entrepreneurs above 18 years. For non-individual enterprises, 51% shareholding and controlling stake should be held by SC/ST or woman entrepreneur. Must be setting up a greenfield project (first-time venture). Borrower should not be in default to any bank or financial institution.",
    benefits:
      "Composite loan (term loan + working capital) between Rs. 10 lakh and Rs. 1 crore. Repayment period up to 7 years with moratorium period up to 18 months. No processing charges. Facilitates financing in manufacturing, services, or trading sector.",
    applicationProcess:
      "Apply online at standupmitra.in or visit nearest bank branch. Documents: business plan, identity proof, address proof, caste/gender certificate, project report, last 6 months bank statement.",
    source: "https://standupmitra.in",
    keywords: [
      "standup india", "SC loan", "ST loan", "woman entrepreneur", "greenfield",
      "10 lakh loan", "1 crore", "scheduled caste business loan",
    ],
  },
  {
    id: "vidya-lakshmi",
    schemeName: "Vidya Lakshmi Education Loan Portal",
    sector: "education",
    ministry: "Ministry of Education",
    tags: ["loan", "education loan", "student", "higher education", "interest subsidy"],
    description:
      "Vidya Lakshmi is a first-of-its-kind portal for students seeking Education Loan. It provides a single window for students to access information and make applications for Educational Loans provided by banks and government scholarships.",
    eligibility:
      "Any Indian student pursuing higher education in India or abroad. Eligibility for specific loan schemes and interest subsidies (like CSIS for students with parental income up to Rs. 4.5 lakh) depends on the individual bank and government criteria.",
    benefits:
      "Single window portal for accessing multiple banks and loan schemes. Common Educational Loan Application Form (CELAF) for applying to multiple banks. Facility to apply for government scholarships alongside loans. Tracking of loan application status.",
    applicationProcess:
      "Register on the Vidya Lakshmi portal (vidyalakshmi.co.in). Fill the Common Education Loan Application Form (CELAF). Search and apply for education loan schemes from various registered banks. Track application status online.",
    source: "https://www.vidyalakshmi.co.in",
    keywords: [
      "education loan", "student loan", "vidya lakshmi", "vidyalakshmi", "higher education",
      "CSIS", "interest subsidy", "CELAF", "study loan",
    ],
  },
];

export const SECTORS = [...new Set(POLICY_KNOWLEDGE_BASE.map((p) => p.sector))];
export const MINISTRIES = [...new Set(POLICY_KNOWLEDGE_BASE.map((p) => p.ministry))];

export function searchPolicies(query: string, topK = 5): PolicyChunk[] {
  const q = query.toLowerCase();

  const scored = POLICY_KNOWLEDGE_BASE.map((policy) => {
    let score = 0;
    const searchableText = [
      policy.schemeName,
      policy.description,
      policy.eligibility,
      policy.benefits,
      ...policy.keywords,
      ...policy.tags,
      policy.sector,
      policy.ministry,
    ]
      .join(" ")
      .toLowerCase();

    for (const word of q.split(/\s+/)) {
      if (word.length < 2) continue;
      if (policy.schemeName.toLowerCase().includes(word)) score += 5;
      if (policy.keywords.some((k) => k.includes(word))) score += 4;
      if (policy.tags.some((t) => t.includes(word))) score += 3;
      if (searchableText.includes(word)) score += 1;
    }

    const queryPhrases = [
      "farmer", "agriculture", "crop", "kisan",
      "health", "hospital", "medical", "insurance",
      "student", "education", "scholarship",
      "housing", "house", "shelter", "awas",
      "business", "loan", "entrepreneur", "startup",
      "pension", "retirement", "old age",
      "skill", "training", "employment",
      "toilet", "sanitation",
      "bank", "account", "financial",
    ];

    for (const phrase of queryPhrases) {
      if (q.includes(phrase) && (policy.tags.includes(phrase) || searchableText.includes(phrase))) {
        score += 3;
      }
    }

    return { policy, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.policy);
}
