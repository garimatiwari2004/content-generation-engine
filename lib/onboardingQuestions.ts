export type Question = {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect";
  options?: string[];
  required?: boolean;
};

export const LINKEDIN_ONBOARDING_QUESTIONS: Question[] = 
[
  {
    id: "role",
    question: "What is your current role at HirezApp?",
    type: "select",
    options: [
      "Founder",
      "Recruiter",
      "Engineer",
      "Marketing",
      "Sales",
      "Operations",
      "Other"
    ]
  },
  {
    id: "experience",
    question: "How many years of professional experience do you have?",
    type: "select",
    options: [
      "0-2 years",
      "2-5 years",
      "5-10 years",
      "10-15 years",
      "15+ years"
    ]
  },
  {
    id: "expertise",
    question: "What are your top areas of expertise?",
    type: "multiselect",
    options: [
      "Recruitment",
      "Tech/Engineering",
      "Sales",
      "Marketing",
      "Leadership",
      "Product Development",
      "HR Strategy",
      "Data Analytics"
    ]
  },
  {
    id: "industry_focus",
    question: "What industries do you primarily work with?",
    type: "multiselect",
    options: [
      "Technology",
      "Finance",
      "Healthcare",
      "E-commerce",
      "Startups",
      "Enterprise",
      "Education",
      "Other"
    ]
  },
  {
    id: "professional_mission",
    question: "What is your professional mission or what drives your work?",
    type: "text"
  },
  {
    id: "core_values",
    question: "What are your core professional values?",
    type: "multiselect",
    options: [
      "Innovation",
      "Integrity",
      "Excellence",
      "Collaboration",
      "Transparency",
      "Growth Mindset",
      "Customer Focus",
      "Inclusivity"
    ]
  },
  {
    id: "unique_approach",
    question: "What makes your approach or perspective unique?",
    type: "text"
  },
  {
    id: "post_tone",
    question: "What tone do you prefer for your LinkedIn posts?",
    type: "select",
    options: [
      "Inspirational",
      "Educational",
      "Conversational",
      "Thought Leadership",
      "Humorous",
      "Data-Driven"
    ]
  },
  {
    id: "content_preference",
    question: "What type of content do you prefer to share?",
    type: "multiselect",
    options: [
      "Personal Stories",
      "Industry Insights",
      "Practical Tips",
      "Company Updates",
      "Career Advice",
      "Trend Analysis",
      "Success Stories",
      "Lessons Learned"
    ]
  },
  {
    id: "trending_topics",
    question: "What topics or trends in your field excite you most?",
    type: "text"
  },
  {
    id: "target_audience",
    question: "Who is your primary target audience on LinkedIn?",
    type: "multiselect",
    options: [
      "Job Seekers",
      "Clients/Prospects",
      "Industry Peers",
      "Investors",
      "Teams/Direct Reports",
      "Startups",
      "Enterprise Leaders"
    ]
  },
  {
    id: "linkedin_goals",
    question: "What is your primary goal with LinkedIn?",
    type: "select",
    options: [
      "Build Authority",
      "Generate Leads",
      "Network & Relationships",
      "Share Knowledge",
      "Employer Branding",
      "Personal Branding"
    ]
  },
  {
    id: "company_description",
    question: "How would you describe HirezApp and what it does?",
    type: "text"
  },
  {
    id: "competitive_advantage",
    question: "What's your competitive advantage or key differentiator?",
    type: "text"
  },
  {
    id: "problems_solved",
    question: "What problems do you solve for clients or users?",
    type: "multiselect",
    options: [
      "Time to Hire",
      "Talent Quality",
      "Cost Reduction",
      "Process Efficiency",
      "Market Fit",
      "Scalability",
      "User Experience"
    ]
  },
  {
    id: "pain_points",
    question: "What common misconceptions do you want to address in your industry?",
    type: "text"
  },
  
  {
    id: "engagement_goals",
    question: "What type of engagement matters most to you?",
    type: "multiselect",
    options: [
      "Likes & Reactions",
      "Comments & Discussion",
      "Shares & Reposts",
      "Profile Visits",
      "Direct Messages",
      "Connection Requests"
    ]
  },
  {
    id: "call_to_action",
    question: "What do you want readers to do after reading your post?",
    type: "select",
    options: [
      "Start a Conversation",
      "Visit Website/Demo",
      "Connect with Me",
      "Apply for Job",
      "Share Their Experience",
      "Learn More"
    ]
  },
  {
    id: "hashtags",
    question: "What hashtags or keywords do you frequently use?",
    type: "text"
  },
  {
    id: "achievements",
    question: "What career milestones or achievements are you proud of?",
    type: "text"
  }
]