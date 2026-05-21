import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume, ResumeSettings, ResumeState, initialResume, initialSettings } from '@/types/resume';

// Load state from localStorage
const loadState = (): ResumeState | undefined => {
    if (typeof window === 'undefined') return undefined;

    try {
        const serializedState = localStorage.getItem('resumeState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading state from localStorage:', err);
        return undefined;
    }
};

// Save state to localStorage
const saveState = (state: ResumeState) => {
    if (typeof window === 'undefined') return;

    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('resumeState', serializedState);
    } catch (err) {
        console.error('Error saving state to localStorage:', err);
    }
};

const initialState: ResumeState = loadState() || {
    resume: initialResume,
    settings: initialSettings,
    lastModified: new Date().toISOString(),
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        // Update entire resume
        setResume: (state, action: PayloadAction<Resume>) => {
            state.resume = action.payload;
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Update basics
        updateBasics: (state, action: PayloadAction<Partial<Resume['basics']>>) => {
            state.resume.basics = { ...state.resume.basics, ...action.payload };
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Work experience
        addWorkExperience: (state, action: PayloadAction<Resume['work'][0]>) => {
            state.resume.work.push(action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateWorkExperience: (state, action: PayloadAction<{ id: string; data: Partial<Resume['work'][0]> }>) => {
            const index = state.resume.work.findIndex(w => w.id === action.payload.id);
            if (index !== -1) {
                state.resume.work[index] = { ...state.resume.work[index], ...action.payload.data };
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteWorkExperience: (state, action: PayloadAction<string>) => {
            state.resume.work = state.resume.work.filter(w => w.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        reorderWorkExperience: (state, action: PayloadAction<Resume['work']>) => {
            state.resume.work = action.payload;
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Education
        addEducation: (state, action: PayloadAction<Resume['education'][0]>) => {
            state.resume.education.push(action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateEducation: (state, action: PayloadAction<{ id: string; data: Partial<Resume['education'][0]> }>) => {
            const index = state.resume.education.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.resume.education[index] = { ...state.resume.education[index], ...action.payload.data };
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteEducation: (state, action: PayloadAction<string>) => {
            state.resume.education = state.resume.education.filter(e => e.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Skills
        addSkill: (state, action: PayloadAction<Resume['skills'][0]>) => {
            state.resume.skills.push(action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateSkill: (state, action: PayloadAction<{ id: string; data: Partial<Resume['skills'][0]> }>) => {
            const index = state.resume.skills.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.resume.skills[index] = { ...state.resume.skills[index], ...action.payload.data };
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteSkill: (state, action: PayloadAction<string>) => {
            state.resume.skills = state.resume.skills.filter(s => s.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Projects
        addProject: (state, action: PayloadAction<Resume['projects'][0]>) => {
            state.resume.projects.push(action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateProject: (state, action: PayloadAction<{ id: string; data: Partial<Resume['projects'][0]> }>) => {
            const index = state.resume.projects.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.resume.projects[index] = { ...state.resume.projects[index], ...action.payload.data };
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteProject: (state, action: PayloadAction<string>) => {
            state.resume.projects = state.resume.projects.filter(p => p.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Certifications
        addCertification: (state, action: PayloadAction<Resume['certifications'][0]>) => {
            state.resume.certifications.push(action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateCertification: (state, action: PayloadAction<{ id: string; data: Partial<Resume['certifications'][0]> }>) => {
            const index = state.resume.certifications.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.resume.certifications[index] = { ...state.resume.certifications[index], ...action.payload.data };
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteCertification: (state, action: PayloadAction<string>) => {
            state.resume.certifications = state.resume.certifications.filter(c => c.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Custom Sections
        addCustomSection: (state, action: PayloadAction<{ id: string; title: string }>) => {
            if (!state.resume.customSections) {
                state.resume.customSections = [];
            }
            state.resume.customSections.push({
                id: action.payload.id,
                title: action.payload.title,
                items: [],
            });
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        updateCustomSectionTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            if (!state.resume.customSections) return;
            const index = state.resume.customSections.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.resume.customSections[index].title = action.payload.title;
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        deleteCustomSection: (state, action: PayloadAction<string>) => {
            if (!state.resume.customSections) return;
            state.resume.customSections = state.resume.customSections.filter(s => s.id !== action.payload);
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        addCustomSectionItem: (state, action: PayloadAction<{ sectionId: string; item: any }>) => {
            if (!state.resume.customSections) return;
            const section = state.resume.customSections.find(s => s.id === action.payload.sectionId);
            if (section) {
                section.items.push(action.payload.item);
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        updateCustomSectionItem: (state, action: PayloadAction<{ sectionId: string; itemId: string; data: any }>) => {
            if (!state.resume.customSections) return;
            const section = state.resume.customSections.find(s => s.id === action.payload.sectionId);
            if (section) {
                const itemIndex = section.items.findIndex(i => i.id === action.payload.itemId);
                if (itemIndex !== -1) {
                    section.items[itemIndex] = { ...section.items[itemIndex], ...action.payload.data };
                    state.lastModified = new Date().toISOString();
                    saveState(state);
                }
            }
        },

        deleteCustomSectionItem: (state, action: PayloadAction<{ sectionId: string; itemId: string }>) => {
            if (!state.resume.customSections) return;
            const section = state.resume.customSections.find(s => s.id === action.payload.sectionId);
            if (section) {
                section.items = section.items.filter(i => i.id !== action.payload.itemId);
                state.lastModified = new Date().toISOString();
                saveState(state);
            }
        },

        // Settings
        updateSettings: (state, action: PayloadAction<Partial<ResumeSettings>>) => {
            state.settings = { ...state.settings, ...action.payload };
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Reset to default
        resetResume: (state) => {
            state.resume = initialResume;
            state.settings = initialSettings;
            state.lastModified = new Date().toISOString();
            saveState(state);
        },

        // Clear all data
        clearAllData: (state) => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('resumeState');
            }
            state.resume = initialResume;
            state.settings = initialSettings;
            state.lastModified = new Date().toISOString();
        },
    },
});

export const {
    setResume,
    updateBasics,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    reorderWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addCustomSection,
    updateCustomSectionTitle,
    deleteCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    updateSettings,
    resetResume,
    clearAllData,
} = resumeSlice.actions;

export default resumeSlice.reducer;
