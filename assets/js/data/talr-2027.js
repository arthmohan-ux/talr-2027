/*
  TALR 2027 content records. Both TALR pages (/events/talr-2027 and /partners) read from this file.
  Headings and paragraph copy live in the HTML. Lists and records live here.

  event        date, countdown target (startsAtUtc), venue (null shows "Venue to be announced")
  stats        the four TALR numbers under the hero
  pillars      "Why TALR is different" cards
  journey      the 2027 card and every past edition, newest first. Both TALR pages show it as the same
               sidescroller: photo, year, edition, title. Body, theme, venue and facts stay here for reference.
               prelude (2016) is kept for reference, not shown.
  moments      the testimonial carousel on the delegate page (direct: false means paraphrased, shown without quote marks)
  gallery      photo wall, two rows, no captions on screen (caption + year become the alt text)
  (partners    moved to logos.js, TAD_LOGOS.partners: one list for every partner wall on the site)
  (voices      moved to voices.js, TAD_VOICES: shared with /events)
  agenda       arc of the day and the sessions
  partnerPage  records only the partner page uses. industries = the names circling the orbit
  forms        form copy: invite-only terms, reply time (sla), done-state text, designation suggestions.
  industries   the old 42-option industry list, no longer used by the form (the form uses the 18 canonical
               industries in form-data.js so company picks can fill Industry). Kept for reference.
  organisations every organisation on record across TALR editions (not shown on the site; kept for reference)

  Speakers live in talr-speakers.js. Platform numbers shared across pages live in platform.js.
*/
window.TALR = {
  "event": {
    "name": "The TA Leadership Retreat",
    "shortName": "TALR",
    "edition": "10th Edition",
    "editionNumber": 10,
    "dateLabel": "26 February 2027",
    "startsAtUtc": "2027-02-26T03:30:00Z",
    "venue": null,
    "descriptor": "A curated retreat for TA leaders, CXOs & GCC leaders",
    "tagline": "Ten Editions. One Evolving Conversation. A Future of Talent Leadership.",
    "taglineIsFinal": false,
    "organiser": "TA Dialogues"
  },
  "contact": {
    "email": "connect@tadialogues.in",
    "phoneDisplay": "+91 95133 50380",
    "phoneE164": "+919513350380",
    "linkedin": "https://www.linkedin.com/company/ta-dialogues/",
    "website": "https://www.tadialogues.in",
    "privacyPolicyUrl": "/privacy-policy",
    "termsUrl": null
  },
  "stats": [
    {
      "value": 9,
      "suffix": "",
      "label": "Editions completed",
      "note": "2017 to 2026, with the 10th edition on 26 February 2027"
    },
    {
      "value": 900,
      "suffix": "+",
      "label": "Past TA leaders engaged",
      "note": "Senior TA and talent leaders across nine editions"
    },
    {
      "value": 100,
      "suffix": "+",
      "label": "Speakers",
      "note": "CEOs, business heads and TA leaders on the TALR stage"
    },
    {
      "value": 600,
      "suffix": "+",
      "label": "Companies engaged",
      "note": "From GCCs to Fortune 500 enterprises"
    }
  ],
  "pillars": [
    {
      "number": "01",
      "title": "Connect with TA Leaders Across Industries",
      "body": "A gathering of *Talent Acquisition leaders* from diverse industries, offering an opportunity to exchange perspectives, share experiences and engage in meaningful conversations. Build connections with peers, gain fresh perspectives on shared industry challenges and develop relationships that extend well beyond the retreat.",
      "points": []
    },
    {
      "number": "02",
      "title": "Experiences Beyond the Boardroom",
      "body": "TALR goes beyond the conventional conference format. Alongside thought-provoking discussions, it brings together experiences designed to foster genuine connections, encourage interaction and create lasting memories. Because the value of the retreat lies not only in the conversations you have, but also in the people you meet and the experiences you share.",
      "pointsLead": "Experiences from previous editions have included:",
      "points": [
        "Exclusive golf experiences",
        "Curated wellness and rejuvenation sessions",
        "A range of thoughtfully curated social and recreational experiences"
      ]
    },
    {
      "number": "03",
      "title": "Gain Insights from CXO Perspectives",
      "body": "Hear directly from CXOs and Managing Directors as they share their perspectives on talent strategy, evolving workforce priorities and the changing demands of hiring and retaining talent. Through interactive Q&A sessions, put forward questions that matter to you, exchange perspectives and gain valuable insights from the decision-makers shaping organisational direction.",
      "points": []
    }
  ],
  "journey": {
    "next": {
      "edition": "Edition 10",
      "date": "26 February 2027",
      "title": "The 10th Edition",
      "body": "A milestone a decade in the making. The next conversation starts here."
    },
    "chapters": [
      {
        "edition": "Edition 9",
        "year": "2026",
        "date": "27 February 2026",
        "venue": "JW Marriott Prestige Golfshire, Bengaluru",
        "title": "Hire. Fire. Rewire.",
        "theme": "Redefining the TA leadership playbook for 2026",
        "body": "The Golf Edition brought two CEO panels and an Industry Roundtable together under a single question: how must the TA leadership playbook be rewritten?",
        "facts": [
          "Golf Edition",
          "Two CEO panels",
          "Industry Roundtable"
        ],
        "image": "/assets/img/photos/talr-2026/mg-5220-1600.jpg"
      },
      {
        "edition": "Edition 8",
        "year": "2025",
        "date": "2025",
        "venue": "The Tamarind Tree, Bengaluru",
        "title": "A Retreat in Every Sense",
        "theme": "",
        "body": "The eighth edition added a wellness layer to the day: a deliberate pause between conversations, and a sign of how the retreat experience keeps evolving.",
        "facts": [
          "Wellness experience"
        ],
        "image": "/assets/img/talr/journey/talr-2025.webp"
      },
      {
        "edition": "Edition 4",
        "year": "2021",
        "date": "29 January 2021",
        "venue": "Prestige Golfshire, Bengaluru",
        "title": "A Bold Step Towards a New Normal",
        "theme": "CEOs' perspectives on the changing face of talent acquisition",
        "body": "Socially distanced but professionally united: the 2021 retreat was TA Dialogues' first gathering in person of the new normal. 95% of delegates said they would attend again.",
        "facts": [
          "40+ companies",
          "Golf Edition"
        ],
        "image": "/assets/img/talr/journey/talr-2021.webp"
      },
      {
        "edition": "Edition 3",
        "year": "2020",
        "date": "17 January 2020",
        "venue": "Prestige Golfshire, Bengaluru",
        "title": "TA in the Boardroom, Revisited",
        "theme": "TA in the Boardroom: CEOs' perspective",
        "body": "A room of 60+ TA heads. Business leaders from TCS, ANZ, Infosys BPM and Standard Chartered GBS shared what they expect from TA, and what TA must bring to earn its seat at the table.",
        "facts": [
          "60+ TA heads",
          "50+ companies"
        ],
        "image": "/assets/img/talr/journey/talr-2020.webp"
      },
      {
        "edition": "Edition 2",
        "year": "2019",
        "date": "18 January 2019",
        "venue": "Prestige Golfshire, Bengaluru",
        "title": "The Future of Talent Acquisition",
        "theme": "CEOs' perspectives on the future of talent acquisition",
        "body": "Fire @ the CEO took the stage: TA heads put prepared and impromptu questions directly to CEOs.",
        "facts": [
          "50 TA heads",
          "Fire @ the CEO"
        ],
        "image": "/assets/img/talr/journey/talr-2019.webp"
      },
      {
        "edition": "Edition 1",
        "year": "2017",
        "date": "8 September 2017",
        "venue": "Prestige Golfshire, Bengaluru",
        "title": "TA in the Boardroom",
        "theme": "How should CTAOs drive decisions for the CXO table?",
        "body": "The first retreat paired a CEO Roundtable with a TA Roundtable, so the people who bring in talent could hear first hand how the board sees it. Then the conversation moved out to the golf greens.",
        "facts": [
          "100 TA heads",
          "CEO Roundtable + TA Roundtable",
          "Golf on the greens"
        ],
        "image": "/assets/img/talr/journey/talr-2017.webp"
      }
    ],
    "prelude": {
      "year": "2016",
      "title": "Where the conversation began",
      "body": "TA Dialogues started in September 2016 as the Recruiters' Breakfast Series, a small morning gathering of recruiters and TA specialists. It grew into India's largest platform for the talent acquisition function, and TALR became its flagship."
    }
  },
  "moments": [
    {
      "quote": "This was a panel discussion followed by a fireside chat that highlighted insights and methodologies that are relevant, carry enterprise value and, most importantly, put the Talent Partners at the epicentre of this transformation journey.",
      "by": "Sweety Rath",
      "context": "Moderator, 2021",
      "direct": true
    },
    {
      "quote": "Credibility, culture, commitment and compassion: the four C's that tie TA to the business.",
      "by": "Mukul Ghosh",
      "context": "Global VP, Aspect Software, 2021, as reported",
      "direct": false
    },
    {
      "quote": "Culture and employer branding are a collective responsibility, not the job of one function alone.",
      "by": "CEO panel consensus",
      "context": "Fire @ the CEO, 2019, as reported",
      "direct": false
    }
  ],
  "gallery": [
    {
      "image": "/assets/img/talr/gallery/talr-2020-01.webp",
      "caption": "The 2020 room at Prestige Golfshire",
      "year": 2020,
      "aspect": 1.5,
      "w": 1536,
      "h": 1024
    },
    {
      "image": "/assets/img/talr/gallery/talr-2017-02.webp",
      "caption": "Golf on the greens",
      "year": 2017,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-03.webp",
      "caption": "TA in the Boardroom, CEO panel",
      "year": 2020,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2019-04.webp",
      "caption": "Golf clinic",
      "year": 2019,
      "aspect": 0.709,
      "w": 1135,
      "h": 1600
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-05.webp",
      "caption": "Socially distanced, professionally united",
      "year": 2021,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-06.webp",
      "caption": "Between sessions",
      "year": 2020,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-07.webp",
      "caption": "Conversations under the canopy",
      "year": 2021,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-08.webp",
      "caption": "Golf clinic",
      "year": 2020,
      "aspect": 2.222,
      "w": 1600,
      "h": 720
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-09.webp",
      "caption": "On stage",
      "year": 2021,
      "aspect": 0.667,
      "w": 1067,
      "h": 1600
    },
    {
      "image": "/assets/img/talr/gallery/talr-2019-10.webp",
      "caption": "Arrivals",
      "year": 2019,
      "aspect": 1.298,
      "w": 1286,
      "h": 991
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-11.webp",
      "caption": "Speakers 2020",
      "year": 2020,
      "aspect": 2.222,
      "w": 1600,
      "h": 720
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-12.webp",
      "caption": "Golf clinic",
      "year": 2021,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-13.webp",
      "caption": "Golf clinic",
      "year": 2021,
      "aspect": 1.5,
      "w": 1200,
      "h": 800
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-14.webp",
      "caption": "Speaker recognition",
      "year": 2020,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-15.webp",
      "caption": "In conversation",
      "year": 2021,
      "aspect": 0.667,
      "w": 800,
      "h": 1200
    },
    {
      "image": "/assets/img/talr/gallery/talr-2020-16.webp",
      "caption": "CEO panel",
      "year": 2020,
      "aspect": 1.5,
      "w": 1600,
      "h": 1067
    },
    {
      "image": "/assets/img/talr/gallery/talr-2021-17.webp",
      "caption": "Peer conversations",
      "year": 2021,
      "aspect": 1.5,
      "w": 1200,
      "h": 800
    },
    {
      "image": "/assets/img/talr/gallery/talr-2019-18.webp",
      "caption": "On the course",
      "year": 2019,
      "aspect": 1.149,
      "w": 1600,
      "h": 1393
    }
  ],
  "agenda": {
    "arc": [
      {
        "code": "SIGNAL",
        "line": "Read the forces reshaping hiring, straight from the people making the calls."
      },
      {
        "code": "SYNC",
        "line": "Put your questions to the C-suite, and calibrate against 300 peers facing the same decisions."
      },
      {
        "code": "STEER",
        "line": "Build your industry's playbook with your peers, and leave with the course set for the year ahead."
      }
    ],
    "sessions": [
      {
        "time": "9:30 AM",
        "endTime": "10:00 AM",
        "kind": "session",
        "label": "Keynote",
        "title": "Opening keynote",
        "desc": "Hear from a top voice in the industry as they set the tone for the day. The name lands closer to the date."
      },
      {
        "time": "10:00 AM",
        "endTime": "11:15 AM",
        "kind": "panel",
        "label": "Panel 1",
        "code": "SIGNAL",
        "title": "C-Suite Leaders’ Perspectives: The New Talent Standard",
        "desc": "Hear from the people who sign off on headcount and make the calls at the top, on the shifts they are seeing in the talent landscape and what those shifts mean for the way you hire."
      },
      {
        "time": "11:15 AM",
        "kind": "break",
        "title": "Networking break",
        "desc": "Step out, find your peers, and let the corridor conversations start."
      },
      {
        "time": "11:45 AM",
        "endTime": "1:00 PM",
        "kind": "panel",
        "label": "Panel 2",
        "code": "SYNC",
        "title": "Fire at the C-Suite: Where Are We Headed",
        "desc": "The hour where the questions go the other way. TA leaders ask, the C-suite answers, live and unscripted. Come with the questions you actually want answered, and leave with the view from the top on every one of them."
      },
      {
        "time": "1:00 PM",
        "endTime": "2:00 PM",
        "kind": "break",
        "title": "Lunch",
        "desc": "A spread worth taking your time over, and the ambience of the venue around you. Good food, better company!"
      },
      {
        "time": "2:00 PM",
        "endTime": "3:00 PM",
        "kind": "experience",
        "label": "Experience",
        "title": "The Retreat Experience",
        "desc": "Consider this the day’s surprise. Come ready to leave the room and the title behind, and just enjoy it with your peers. Our delegates are still talking about the last two editions. Stay tuned!"
      },
      {
        "time": "3:00 PM",
        "endTime": "4:00 PM",
        "kind": "panel",
        "label": "Roundtables",
        "code": "STEER",
        "title": "Setting the Course: Industry Roundtables",
        "desc": "One table, and the TA leaders hiring against the same market you are. One hour to work through what is actually coming at your industry, and to co-create the playbook for the course ahead.",
        "note": "Running alongside: fireside chats and podcast recordings, if you would rather be on the mic."
      },
      {
        "time": "4:00 PM",
        "endTime": "5:00 PM",
        "kind": "session",
        "label": "To be announced",
        "title": "The Closing Hour",
        "desc": "The final hour of the retreat is still under wraps. All we will say is that it is built to be worth staying for."
      },
      {
        "time": "5:00 PM",
        "kind": "break",
        "title": "High tea and networking",
        "desc": "The slow end to the day. Unwind, take in the venue, and let the conversations run as long as they want."
      }
    ]
  },
  "partnerPage": {
    "roles": [
      "CEOs",
      "Talent Strategy Leaders",
      "MDs",
      "CHROs",
      "Founders",
      "TA Directors & VPs",
      "GCC Talent Leaders",
      "Global Heads of TA"
    ],
    "forms": {
      "eventKey": "TALR 2027",
      "attend": {
        "terms": "TALR is by invitation. Submitting your interest does not confirm a seat. Seats are offered on the relevance of a leader's experience, role and contribution to the conversation.",
        "sla": "within 3 working days",
        "done": "Our team reviews every request personally. If your profile is a fit, we will reach out to confirm eligibility and next steps."
      },
      "partner": {
        "terms": "Partner places are deliberately limited. Every partnership is shaped with you, and confirmed only once we agree on a brief.",
        "sla": "within 48 hours",
        "done": "Our partnerships team will come back with a brief built around your goals."
      },
      "featuredQuestion": "Would you be open to being featured in TALR's marketing on LinkedIn and other platforms?",
      "attendDesignations": [
        "CEO / Managing Director",
        "Founder / Co-founder",
        "CHRO / Chief People Officer",
        "CXO",
        "Business Head",
        "GCC Site Leader / Country Head",
        "Global Head of Talent Acquisition",
        "Head of Talent Acquisition",
        "VP / AVP Talent Acquisition",
        "Director, Talent Acquisition",
        "Senior Manager, Talent Acquisition",
        "Head of HR",
        "Talent Strategy Leader",
        "Employer Branding Lead"
      ],
      "partnerDesignations": [
        "CEO / Managing Director",
        "Founder / Co-founder",
        "CXO",
        "VP / Head of Sales",
        "Head of Marketing",
        "Partnerships / Alliances Lead",
        "Business Development Lead",
        "Product Leader",
        "Customer Success Leader",
        "HR / TA Leader"
      ]
    },
    "industries": [
      "IT Services & Consulting",
      "IT Products & SaaS",
      "BFSI / GBS",
      "Pharma & Life Sciences",
      "Manufacturing & Engineering",
      "Semiconductor",
      "Telecom",
      "Consumer, Retail & Ecommerce",
      "Professional Services"
    ],
    "why": [
      {
        "title": "Direct access to decision-makers",
        "problem": "Skip the gatekeepers.",
        "outcome": "Meet the TA leaders, CHROs and C-suite who decide on hiring and business investments, and showcase your offering through booths and one-on-one conversations."
      },
      {
        "title": "A seat in the conversation",
        "problem": "Add your voice to the conversation.",
        "outcome": "Contribute your expertise through knowledge-sharing sessions and industry roundtables, alongside senior practitioners."
      },
      {
        "title": "Relationships that last",
        "problem": "Fewer cold emails, warmer conversations.",
        "outcome": "Curated networking and relaxed, shared experiences turn introductions into lasting professional connections that continue well after the event."
      },
      {
        "title": "Credibility that carries",
        "problem": "Be known before the first conversation.",
        "outcome": "Put your brand in an exclusive room backed by TA Dialogues, India’s most trusted TA community, with 10 years and a 150K+ network behind it."
      },
      {
        "title": "Reach beyond the room",
        "problem": "Visibility before, during and after the day.",
        "outcome": "Be introduced through the pre-event campaign, seen through your booth, sessions and venue branding on the day, and remembered through post-event coverage."
      }
    ],
    "ways": [
      {
        "role": "TA & HR Tech Partners",
        "line": "Put your solution in front of the TA leaders, CHROs and C-suite who evaluate and choose it.",
        "art": "conversation",
        "cta": "Explore a partnership"
      },
      {
        "role": "Education & Knowledge Partners",
        "line": "Position your institution as a trusted voice in talent and leadership. Share your research and insights with senior TA and HR leaders through sessions and roundtables.",
        "art": "wave",
        "cta": "Start a conversation"
      },
      {
        "role": "Corporate & Lifestyle Experience Partners",
        "line": "Reach the HR and TA leaders who decide what their people get, from health and insurance to wellness, rewards and workplace experiences. Showcase your offering where those decisions begin.",
        "art": "golf",
        "cta": "Shape the experience"
      }
    ],
    "quotes": [
      "An insightful experience that brought together meaningful conversations, diverse perspectives, and ideas for the future.",
      "The discussions offered practical insights and fresh perspectives on how technology is reshaping Talent Acquisition.",
      "A valuable platform to exchange ideas, explore new perspectives, and rethink the future of Talent Acquisition.",
      "The conversations were candid, insightful, and gave me perspectives I could take back to my organisation.",
      "Really enjoyed the diverse perspectives and breadth of the conversation, along with the openness of the room."
    ],
    "formSuccess": "Thank you, our partnerships team will reach out within 48 hours with a brief built around your goals.",
    "partnershipsContact": {
      "email": "events@tadialogues.in",
      "phone": "+91 90710 14575"
    }
  },
  "forms": {
    "eventKey": "TALR 2027",
    "attend": {
      "terms": "TALR is by invitation. Submitting your interest does not confirm a seat. Seats are offered on the relevance of a leader's experience, role and contribution to the conversation.",
      "sla": "within 3 working days",
      "done": "Our team reviews every request personally. If your profile is a fit, we will reach out to confirm eligibility and next steps."
    },
    "partner": {
      "terms": "Partner places are deliberately limited. Every partnership is shaped with you, and confirmed only once we agree on a brief.",
      "sla": "within 48 hours",
      "done": "Our partnerships team will come back with a brief built around your goals."
    },
    "featuredQuestion": "Would you be open to being featured in TALR's marketing on LinkedIn and other platforms?",
    "attendDesignations": [
      "CEO / Managing Director",
      "Founder / Co-founder",
      "CHRO / Chief People Officer",
      "CXO",
      "Business Head",
      "GCC Site Leader / Country Head",
      "Global Head of Talent Acquisition",
      "Head of Talent Acquisition",
      "VP / AVP Talent Acquisition",
      "Director, Talent Acquisition",
      "Senior Manager, Talent Acquisition",
      "Head of HR",
      "Talent Strategy Leader",
      "Employer Branding Lead"
    ],
    "partnerDesignations": [
      "CEO / Managing Director",
      "Founder / Co-founder",
      "CXO",
      "VP / Head of Sales",
      "Head of Marketing",
      "Partnerships / Alliances Lead",
      "Business Development Lead",
      "Product Leader",
      "Customer Success Leader",
      "HR / TA Leader"
    ]
  },
  "industries": [
    "Aerospace & Defence",
    "Agriculture & Agritech",
    "Automotive",
    "Aviation",
    "Banking",
    "BFSI",
    "BPM / ITES",
    "Chemicals",
    "Construction & Infrastructure",
    "Consulting & Professional Services",
    "Consumer Goods / FMCG",
    "Ecommerce",
    "Education & EdTech",
    "Electronics & Hardware",
    "Energy & Utilities",
    "Engineering & R&D Services",
    "Financial Services",
    "Fintech",
    "Gaming",
    "GCC / Global Capability Centre",
    "Government & Public Sector",
    "Healthcare",
    "Hospitality & Travel",
    "Insurance",
    "IT Services",
    "Legal Services",
    "Logistics & Supply Chain",
    "Manufacturing",
    "Media & Entertainment",
    "Metals & Mining",
    "Nonprofit",
    "Oil & Gas",
    "Pharma & Life Sciences",
    "Real Estate",
    "Renewable Energy",
    "Retail",
    "Semiconductors",
    "Software / SaaS",
    "Staffing & Recruitment",
    "Telecom",
    "Textiles & Apparel",
    "Other"
  ],
  "organisations": [
    "Accel",
    "Accenture",
    "Accion Labs",
    "Akamai",
    "Alorica",
    "ANZ",
    "AQR",
    "Arcesium",
    "Aristocrat",
    "Aspect Software",
    "Attra",
    "AXA",
    "Axiscades",
    "Bajaj Capital",
    "Blue Yonder",
    "BusinessOne",
    "Capillary",
    "CGI",
    "Ciber",
    "Cigniti",
    "Citrix",
    "Conneqt",
    "Convergytics",
    "Course5",
    "Danske IT",
    "Dassault",
    "DBS",
    "Deloitte",
    "Diageo",
    "EdgeVerve",
    "EY",
    "Gallagher",
    "GE",
    "Gibraltar",
    "Goldman Sachs",
    "HCL",
    "HGS",
    "Hitachi Vantara",
    "IBM",
    "IHS Markit",
    "Indegene",
    "InfoCepts",
    "Informatica",
    "Infosys BPM",
    "Innovatia",
    "Inspirage",
    "JCPenney",
    "JPMorgan Chase & Co.",
    "Kmart (KAS Services)",
    "Koch",
    "Lowe's",
    "MaxVal IP",
    "MetricStream",
    "Microland",
    "Mindtree",
    "Molex",
    "Morgan Stanley",
    "Narayana Health",
    "NESS",
    "NextGen Healthcare",
    "Northern Trust",
    "NTT Data",
    "Oracle",
    "Performation Consulting",
    "Qualcomm",
    "Sapient",
    "Scientific Games",
    "Seven Lakes",
    "Shell",
    "Shenzyn",
    "Siemens",
    "Societe Generale",
    "Standard Chartered",
    "State Street",
    "Steer Engineering",
    "Swiss Re",
    "Tata Consultancy Services",
    "Tata Insights",
    "TE Connectivity",
    "TiVo",
    "Uber",
    "Volvo",
    "Walmart Labs",
    "Webtec",
    "Wooqer",
    "Xiaomi",
    "Xperi",
    "Xylem"
  ]
};
