// Resume data structure based on myresume and your existing data
export interface Resume {
    basics: Basics;
    work: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    customSections?: CustomSection[];
}

export interface Basics {
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
    customFields?: CustomField[];
}

export interface CustomField {
    id: string;
    name: string; // e.g. "GitHub", "Portfolio", "LinkedIn"
    value: string; // e.g. "github.com/johndoe"
    icon?: 'github' | 'linkedin' | 'portfolio' | 'website' | 'twitter' | 'email' | 'phone' | 'other'; // Icon type for display
}

export interface CustomSection {
    id: string;
    title: string; // e.g. "Publications", "Awards", "Languages"
    items: CustomSectionItem[];
}

export interface CustomSectionItem {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
    details?: string[]; // Array of bullet points or details
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    additionalInfo?: string[];
}

export interface Skill {
    id: string;
    category: string;
    skills: string[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    date: string;
    highlights: string[];
    technologies?: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date?: string;
    url?: string;
}

// Settings for resume customization
export interface ResumeSettings {
    fontFamily: 'Helvetica' | 'Times' | 'Courier';
    fontSize: number;
    spacing: 'compact' | 'normal' | 'relaxed';
    theme: 'professional' | 'modern' | 'minimal';
}

// Complete resume state
export interface ResumeState {
    resume: Resume;
    settings: ResumeSettings;
    lastModified: string;
}

// Initial/default resume data (Placeholder)
export const initialResume: Resume = {
    basics: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        url: 'https://linkedin.com/in/johndoe',
        summary: 'Experienced software engineer with a passion for building scalable web applications. Proven track record of delivering high-quality code and collaborating effectively in cross-functional teams. Skilled in modern JavaScript frameworks and cloud technologies.',
        customFields: [],
    },
    work: [
        {
            id: '1',
            company: 'Tech Solutions Inc.',
            position: 'Senior Software Engineer',
            location: 'New York, NY',
            startDate: 'Jan 2020',
            endDate: 'Present',
            highlights: [
                'Led the development of a high-traffic e-commerce platform using Next.js and Node.js.',
                'Optimized application performance, reducing load times by 40%.',
                'Mentored junior developers and conducted code reviews to maintain code quality.',
            ],
        },
        {
            id: '2',
            company: 'Creative Agency',
            position: 'Web Developer',
            location: 'Brooklyn, NY',
            startDate: 'Jun 2018',
            endDate: 'Dec 2019',
            highlights: [
                'Collaborated with designers to implement pixel-perfect user interfaces.',
                'Developed responsive websites for various clients using HTML, CSS, and JavaScript.',
                'Managed content updates and maintenance for existing client sites.',
            ],
        },
    ],
    education: [
        {
            id: '1',
            institution: 'State University',
            degree: 'Bachelor of Science (B.S.)',
            field: 'Computer Science',
            location: 'Anytown, USA',
            startDate: '2014',
            endDate: '2018',
            gpa: '3.8 / 4.0',
        },
    ],
    skills: [
        {
            id: '1',
            category: 'Languages',
            skills: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
        },
        {
            id: '2',
            category: 'Frontend',
            skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
        },
        {
            id: '3',
            category: 'Backend',
            skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
        },
    ],
    projects: [
        {
            id: '1',
            name: 'Project Alpha',
            description: 'A task management application for teams.',
            date: '2021',
            highlights: [
                'Built the frontend using React and Redux for state management.',
                'Implemented real-time updates using WebSockets.',
            ],
        },
        {
            id: '2',
            name: 'Project Beta',
            description: 'An open-source library for data visualization.',
            date: '2020',
            highlights: [
                'Authored comprehensive documentation and usage examples.',
                'Achieved over 1,000 stars on GitHub.',
            ],
        },
    ],
    certifications: [
        {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
        },
        {
            id: '2',
            name: 'Meta Front-End Developer Certificate',
            issuer: 'Meta',
        },
    ],
    customSections: [],
};

export const initialSettings: ResumeSettings = {
    fontFamily: 'Helvetica',
    fontSize: 11,
    spacing: 'normal',
    theme: 'professional',
};
