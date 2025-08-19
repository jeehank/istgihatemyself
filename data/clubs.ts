export interface Club {
  id: string
  name: string
  slug: string
  description: string
  activities: string[]
  entryFee: number
  about: string
  color: string
  leadership: {
    president: string
    vicePresident: string
    secretary: string
  }
}

export const clubs: Club[] = [
  {
    id: '1',
    name: 'X Code',
    slug: 'x-code',
    description: 'Programming and coding club for aspiring developers',
    activities: ['Web Development', 'App Development', 'Coding Competitions', 'Tech Talks', 'Hackathons'],
    entryFee: 150,
    about: 'X Code is dedicated to fostering programming skills and technological innovation among students. We organize coding workshops, hackathons, and tech talks to keep members updated with the latest in technology.',
    color: 'bg-blue-600',
    leadership: {
      president: 'Arjun Sharma',
      vicePresident: 'Priya Patel',
      secretary: 'Rohan Gupta'
    }
  },
  {
    id: '2',
    name: 'X Commercia',
    slug: 'x-commercia',
    description: 'Commerce club focusing on business and economics',
    activities: ['Business Case Studies', 'Stock Market Analysis', 'Entrepreneurship', 'Finance Workshops', 'Mock Trading'],
    entryFee: 150,
    about: 'X Commercia provides a platform for students interested in commerce, business, and economics. We conduct workshops on finance, entrepreneurship, and market analysis.',
    color: 'bg-green-600',
    leadership: {
      president: 'Kavya Singh',
      vicePresident: 'Aditya Jain',
      secretary: 'Nisha Verma'
    }
  },
  {
    id: '3',
    name: 'X Perimentia',
    slug: 'x-perimentia',
    description: 'Science club for experimental and theoretical sciences',
    activities: ['Science Experiments', 'Research Projects', 'Science Fair', 'Lab Sessions', 'STEM Workshops'],
    entryFee: 150,
    about: 'X Perimentia encourages scientific thinking and experimentation. Members engage in hands-on experiments, research projects, and participate in science fairs.',
    color: 'bg-purple-600',
    leadership: {
      president: 'Ananya Das',
      vicePresident: 'Vikram Roy',
      secretary: 'Shreya Bose'
    }
  },
  {
    id: '4',
    name: 'Social Service',
    slug: 'social-service',
    description: 'Community service and social awareness club',
    activities: ['Community Outreach', 'Charity Drives', 'Awareness Campaigns', 'Volunteer Work', 'Social Projects'],
    entryFee: 150,
    about: 'Social Service club focuses on community welfare and social responsibility. We organize charity drives, awareness campaigns, and volunteer activities.',
    color: 'bg-red-600',
    leadership: {
      president: 'Siddharth Kumar',
      vicePresident: 'Meera Nair',
      secretary: 'Rahul Mishra'
    }
  },
  {
    id: '5',
    name: 'Nature Club',
    slug: 'nature-club',
    description: 'Environmental conservation and nature appreciation',
    activities: ['Tree Plantation', 'Nature Walks', 'Environmental Awareness', 'Recycling Campaigns', 'Eco Projects'],
    entryFee: 150,
    about: 'Nature Club promotes environmental awareness and conservation. We organize tree plantation drives, nature walks, and eco-friendly projects.',
    color: 'bg-emerald-600',
    leadership: {
      president: 'Arushi Bansal',
      vicePresident: 'Karan Mehta',
      secretary: 'Tanvi Agarwal'
    }
  },
  {
    id: '6',
    name: 'X Script',
    slug: 'x-script',
    description: 'Creative writing and literature club',
    activities: ['Creative Writing', 'Poetry Sessions', 'Story Telling', 'Literature Discussion', 'Writing Competitions'],
    entryFee: 150,
    about: 'X Script nurtures literary talents and creative writing skills. Members participate in writing competitions, poetry sessions, and literature discussions.',
    color: 'bg-indigo-600',
    leadership: {
      president: 'Ishita Ghosh',
      vicePresident: 'Aryan Kapoor',
      secretary: 'Pooja Yadav'
    }
  },
  {
    id: '7',
    name: 'XQuizite',
    slug: 'xquizite',
    description: 'Quiz and knowledge competition club',
    activities: ['Quiz Competitions', 'Trivia Nights', 'Knowledge Tests', 'Brain Teasers', 'Academic Quizzes'],
    entryFee: 150,
    about: 'XQuizite tests and enhances general knowledge through various quiz competitions and trivia sessions across different subjects.',
    color: 'bg-yellow-600',
    leadership: {
      president: 'Aarav Joshi',
      vicePresident: 'Riya Sinha',
      secretary: 'Dev Pandey'
    }
  },
  {
    id: '8',
    name: 'X Calibre',
    slug: 'x-calibre',
    description: 'Debate and public speaking club',
    activities: ['Debate Competitions', 'Public Speaking', 'Mock Parliament', 'Elocution', 'Discussion Forums'],
    entryFee: 150,
    about: 'X Calibre develops oratory skills and critical thinking through debates, public speaking events, and discussion forums on current affairs.',
    color: 'bg-orange-600',
    leadership: {
      president: 'Divya Malhotra',
      vicePresident: 'Nikhil Saxena',
      secretary: 'Sakshi Tiwari'
    }
  },
  {
    id: '9',
    name: 'X Pixel',
    slug: 'x-pixel',
    description: 'Photography and visual arts club',
    activities: ['Photography Workshops', 'Photo Walks', 'Visual Storytelling', 'Photo Exhibitions', 'Digital Art'],
    entryFee: 150,
    about: 'X Pixel captures moments and creates visual stories through photography. We organize photo walks, workshops, and exhibitions.',
    color: 'bg-pink-600',
    leadership: {
      president: 'Ayush Chandra',
      vicePresident: 'Natasha Khanna',
      secretary: 'Varun Bhatt'
    }
  },
  {
    id: '10',
    name: 'Maths Club',
    slug: 'maths-club',
    description: 'Mathematics and logical reasoning club',
    activities: ['Math Olympiad Training', 'Problem Solving', 'Mathematical Games', 'Logic Puzzles', 'Math Competitions'],
    entryFee: 150,
    about: 'Maths Club promotes mathematical thinking and problem-solving skills through competitions, olympiad training, and mathematical games.',
    color: 'bg-teal-600',
    leadership: {
      president: 'Shubham Aggarwal',
      vicePresident: 'Simran Kaur',
      secretary: 'Harsh Sethi'
    }
  }
]
