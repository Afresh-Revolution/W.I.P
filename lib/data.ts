export const images = {
  hero: "/images/hero.jpg",
  gathering: "/images/gathering.jpg",
  women: "/images/women.jpg",
  community: "/images/community.jpg",
  founder: "/images/founder.jpg",
  portrait2: "/images/portrait-2.jpg",
  portrait3: "/images/portrait-3.jpg",
  portrait4: "/images/portrait-4.jpg",
  event: "/images/event.jpg",
  hands: "/images/hands.jpg",
  logo: "/logos/wipi-logo.jpg",
  map: "/maps/plateau-state-lga-map.png"
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Membership", href: "/membership" },
  { label: "Our Reach", href: "/our-reach" },
  { label: "News & Events", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Leadership", href: "/leadership" },
  { label: "Contact", href: "/contact" }
];

export const lgas = [
  "Barkin Ladi",
  "Bassa",
  "Bokkos",
  "Jos East",
  "Jos North",
  "Jos South",
  "Kanam",
  "Kanke",
  "Langtang North",
  "Langtang South",
  "Mangu",
  "Mikang",
  "Pankshin",
  "Qua'an Pan",
  "Riyom",
  "Shendam",
  "Wase"
];

export const programmes = [
  ["Leadership Training", "Preparing women with practical skills for community and public leadership.", "01"],
  ["Political Participation", "Opening pathways for informed and meaningful engagement in governance.", "02"],
  ["Voter Education", "Helping women understand elections, voting rights and democratic participation.", "03"],
  ["Mentorship", "Connecting emerging leaders with experienced women and professionals.", "04"],
  ["Economic Empowerment", "Supporting resilience, independence and access to opportunity.", "05"],
  ["Protection & Advocacy", "Advocating for safer, more respectful political environments.", "06"],
  ["Peacebuilding", "Equipping women to strengthen dialogue and peace in their communities.", "07"],
  ["Seminars & Workshops", "Accessible learning forums shaped around women's lived realities.", "08"],
  ["Community Development", "Women-led responses to shared local priorities.", "09"],
  ["Stakeholder Engagement", "Building partnerships for more inclusive public institutions.", "10"]
] as const;

export const pillars = [
  ["01", "Political Participation", "Informed access to democratic processes.", "people"],
  ["02", "Leadership & Capacity", "Practical knowledge for public service.", "book"],
  ["03", "Protection & Advocacy", "Safer, more respectful environments.", "shield"],
  ["04", "Mentorship & Networks", "Relationships that create pathways.", "heart"],
  ["05", "Economic Empowerment", "Resilience, agency and opportunity.", "arrow"],
  ["06", "Peace & Community", "Dialogue and locally led progress.", "map"]
] as const;

export const promises = [
  ["Protect", "Advocate for safer political environments."],
  ["Respect", "Promote women’s dignity and leadership."],
  ["Empower", "Build confidence, skills and opportunities."],
  ["Support", "Create networks for women seeking leadership roles."]
] as const;

export const objectives = [
  "Women’s political participation",
  "Protection from political abuse",
  "Inclusiveness in governance",
  "Mentorship and networking",
  "Leadership training",
  "Economic empowerment",
  "Good governance",
  "Self-esteem and confidence",
  "Access to public office",
  "Stakeholder engagement",
  "Public sensitisation",
  "Peacebuilding"
];

export const tiers = [
  { index: "01", name: "Bronze", price: "₦2,000", text: "Women without formal educational qualifications.", featured: false },
  { index: "02", name: "Silver", price: "₦5,000", text: "SSCE, NCE, Diploma or equivalent.", featured: false },
  { index: "03", name: "Gold", price: "₦10,000", text: "HND, Degree, postgraduate or equivalent.", featured: true },
  { index: "04", name: "Community", price: "Free", text: "Participate in selected activities without paid membership.", featured: false }
];

export const heroSlides = [
  {
    label: "Women in Politics Initiative • Plateau State",
    title: ["Empowering Women.", "Strengthening Democracy."],
    text: "Mobilising, equipping and empowering Plateau women to participate meaningfully in governance, peacebuilding and community development.",
    primary: ["Join WIPI", "/join"],
    secondary: ["Discover Our Mission", "/about"],
    image: images.hero
  },
  {
    label: "Leadership & Capacity Building",
    title: ["Preparing Women", "To Lead With Confidence."],
    text: "Through mentorship, training and practical leadership development, WIPI is creating pathways for women to participate confidently in public life.",
    primary: ["Explore Our Programmes", "/programmes"],
    secondary: ["About WIPI", "/about"],
    image: images.gathering
  },
  {
    label: "17 LGAs • 20,000+ Women",
    title: ["One Movement.", "Thousands of Voices."],
    text: "From Bokkos to Jos, Mangu, Pankshin, Langtang and beyond, WIPI is building a growing network of women across Plateau State.",
    primary: ["Explore Our Reach", "/our-reach"],
    secondary: ["Join The Movement", "/join"],
    image: images.event
  },
  {
    label: "Protect • Respect • Empower • Support",
    title: ["Women Deserve A Voice", "Where Decisions Are Made."],
    text: "WIPI advocates for women's representation, safety, dignity and meaningful participation in democratic governance.",
    primary: ["Become A Member", "/join"],
    secondary: ["Partner With WIPI", "/partner"],
    image: images.community
  }
];

export const testimonials = [
  {
    quote: "Leadership training helped me understand that political participation begins long before election day.",
    name: "WIPI Member",
    place: "Jos South • Placeholder",
    image: images.portrait2
  },
  {
    quote: "The mentorship circle gave me a network of women who listen, challenge and encourage me to serve.",
    name: "Community Member",
    place: "Bokkos • Placeholder",
    image: images.portrait3
  },
  {
    quote: "I now feel more confident asking questions about decisions that affect women in my community.",
    name: "Programme Participant",
    place: "Mangu • Placeholder",
    image: images.portrait4
  },
  {
    quote: "WIPI created a place where my experience could become a practical contribution to others.",
    name: "WIPI Member",
    place: "Pankshin • Placeholder",
    image: images.founder
  }
];

export const leaders = [
  { name: "Hajara Yunana", role: "Convener & President", image: images.founder, bio: "Leading a sustainable platform where women are informed, organised, protected and equipped to participate meaningfully." },
  { name: "Amina Bello", role: "Vice President", image: images.portrait2, bio: "Executive team information and portraits below are placeholders pending official confirmation." },
  { name: "Grace Pam", role: "State Coordinator", image: images.portrait3, bio: "Executive team information and portraits below are placeholders pending official confirmation." },
  { name: "Sarah Danladi", role: "Secretary", image: images.portrait4, bio: "Executive team information and portraits below are placeholders pending official confirmation." },
  { name: "Mary John", role: "Director of Programmes", image: images.women, bio: "Executive team information and portraits below are placeholders pending official confirmation." },
  { name: "Fatima Musa", role: "Director of Membership", image: images.gathering, bio: "Executive team information and portraits below are placeholders pending official confirmation." },
  { name: "Ruth Luka", role: "Director of Communications", image: images.event, bio: "Executive team information and portraits below are placeholders pending official confirmation." }
];

export const stories = [
  { category: "Training", title: "WIPI Leadership Training Programme Expands Across Plateau State", date: "12 February 2026", image: images.gathering, tab: "Training", featured: "New local sessions are bringing practical civic knowledge closer to women in communities across the state." },
  { category: "Dialogue", title: "Women, Democracy & Community Development: WIPI Holds Stakeholder Session", date: "28 January 2026", image: images.event, tab: "News" },
  { category: "Voter Education", title: "Voter Education Campaign Reaches New Communities", date: "16 January 2026", image: images.community, tab: "News" },
  { category: "Events", title: "Plateau Women’s Civic Leadership Forum Announced", date: "22 March 2026", image: images.hands, tab: "Events" },
  { category: "Empowerment", title: "Community Mentorship Circles Open In Five LGAs", date: "10 March 2026", image: images.women, tab: "Empowerment" },
  { category: "Advocacy", title: "WIPI Calls For Safe and Inclusive Participation", date: "1 March 2026", image: images.hero, tab: "Advocacy" }
];

export const gallery = [
  { category: "Leadership", caption: "Women gathering for a community session", image: images.gathering },
  { category: "Training", caption: "Leadership learning in action", image: images.women },
  { category: "Community", caption: "Women sharing knowledge", image: images.community },
  { category: "Events", caption: "A statewide gathering", image: images.event },
  { category: "Advocacy", caption: "Community listening session", image: images.hands },
  { category: "Empowerment", caption: "Building support networks", image: images.portrait2 },
  { category: "Leadership", caption: "Women leading with purpose", image: images.founder },
  { category: "Community", caption: "Voices across Plateau", image: images.portrait3 }
];

export const faqs = [
  ["Who can join WIPI?", "Women aged 18 and above who support WIPI’s non-partisan mission may express interest."],
  ["Do I need to belong to a political party?", "No. WIPI is non-partisan and welcomes women across backgrounds."],
  ["Do I need a voter’s card?", "A valid voter’s card—or willingness to register—is encouraged as part of civic participation."],
  ["Can I join without paying?", "Yes. Community Membership provides access to selected activities without a membership contribution."],
  ["What is the difference between paid and Community Membership?", "Paid categories reflect educational qualifications and may include additional member activities. Final benefits are subject to WIPI policy."],
  ["Is uniform compulsory?", "Uniform is required for designated official WIPI activities across all categories."],
  ["Can I change membership category later?", "Category updates can be discussed with the membership team when circumstances change."],
  ["Does registration guarantee access to grants?", "No. Specific grants and programmes may have separate eligibility requirements."],
  ["Can women outside Plateau State join?", "Current structures focus on Plateau State. Register your interest for future expansion."],
  ["How can I become an LGA coordinator?", "Leadership selection processes are managed internally. Contact WIPI for current guidance."]
] as const;

export const uniforms = [
  ["P-Cap", "₦2,000"],
  ["Round Neck", "₦5,000"],
  ["Polo", "₦6,000"],
  ["Jersey-style T-Shirt", "₦4,000"],
  ["Hijab — 3 yards", "₦6,000"],
  ["Hijab — 2½ yards", "₦5,000"],
  ["Hijab — 2 yards", "₦4,000"]
] as const;

export const journey = [
  ["01", "2022", "Founded in Bokkos LGA."],
  ["02", "15 Jan 2026", "Statewide expansion begins."],
  ["03", "2026", "Representation across 17 LGAs."],
  ["04", "Today", "20,000+ reported members."],
  ["05", "Towards 2031", "National expansion ambition."]
] as const;

export const searchIndex = [
  ["About WIPI", "/about", "Mission, vision and the story of the movement"],
  ["Membership", "/membership", "Bronze, Silver, Gold and Community membership"],
  ["Join WIPI", "/join", "Membership registration"],
  ["Leadership training", "/programmes/leadership-training", "Programmes"],
  ["Programmes", "/programmes", "Training, mentorship and voter education"],
  ["Uniform", "/membership/uniform", "Official WIPI uniform"],
  ["Contact", "/contact", "Visit, call or email WIPI"],
  ["LGA chapters", "/our-reach", "All 17 local government areas"],
  ["Leadership", "/leadership", "Hajara Yunana and the executive team"],
  ["News", "/news", "Stories and events"],
  ["Gallery", "/gallery", "WIPI in action"],
  ["Partner", "/partner", "Partnerships"],
  ["FAQs", "/faqs", "Membership questions"]
];

export const legal = {
  privacy: ["Privacy Policy", "Your information, handled with care.", "WIPI stores the details you submit through membership, contact, partnership and interest forms, newsletter addresses, and payment confirmation images so the team can respond and confirm contributions. Access is limited to authorised administrators. A final legal policy should be reviewed before a wider public launch."],
  terms: ["Terms & Conditions", "Clear terms for responsible participation.", "These prototype terms are provided as a structural placeholder. Final terms should be reviewed and approved by WIPI before production launch."],
  accessibility: ["Accessibility", "A website designed to include.", "WIPI is committed to an accessible digital experience with readable type, strong contrast, keyboard-friendly controls and clear labels. Contact us if you encounter a barrier."],
  faqs: ["Frequently Asked Questions", "Helpful answers, all in one place.", "Find guidance on membership, programmes, local chapters, partnerships and participation. For anything else, contact the WIPI team."],
  "coming-soon": ["Coming Soon", "We’re preparing something purposeful.", "This page is being developed as WIPI’s digital platform continues to grow."]
} as const;
