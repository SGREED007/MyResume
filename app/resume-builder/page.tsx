'use client';

// Force dynamic rendering to prevent SSR/prerendering issues with PDF libraries
export const dynamic = 'force-dynamic';


import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
    updateBasics,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
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
    deleteCustomSectionItem
} from '@/lib/redux/resumeSlice';
import { WorkExperience, Education, Skill, Project, Certification } from '@/types/resume';
import dynamicImport from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, Trash2, GripVertical, AlertTriangle, Loader2, Github, Upload } from 'lucide-react';
import { parseResumeFromPdf } from '@/lib/parse-resume';
import { useRef } from 'react';

// Dynamically import PDF components (client-side only)
const ResumePreview = dynamicImport(
    () => import('@/components/resume/ResumePreview'),
    { ssr: false }
);

function ResumeBuilderContent() {
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume.resume);
    const [showForm, setShowForm] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        basics: true,
        work: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
    });

    // Validation states
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');

    // Delete confirmation state
    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        type: string;
        id: string;
        name: string;
        sectionId?: string;
    } | null>(null);

    // Import state
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
    };



    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return true; // Empty is handled by required validation
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address (e.g., john@example.com)');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Phone validation
    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phone) {
            return true; // Empty is handled by required validation
        }
        if (!phoneRegex.test(phone) || phone.length < 10) {
            setPhoneError('Please enter a valid phone number (e.g., +1 234 567 8900)');
            return false;
        }
        setPhoneError('');
        return true;
    };

    // Delete confirmation handler
    const handleDelete = (type: string, id: string, name: string, sectionId?: string) => {
        setDeleteConfirm({ show: true, type, id, name, sectionId });
    };

    // Custom Fields Handlers
    const addCustomField = () => {
        const newField = { id: Date.now().toString(), name: '', value: '' };
        // @ts-ignore - customFields is optional in type
        const currentFields = resume.basics.customFields || [];
        dispatch(updateBasics({ customFields: [...currentFields, newField] }));
    };

    const updateCustomField = (id: string, field: string, value: string) => {
        // @ts-ignore
        const currentFields = resume.basics.customFields || [];
        const updatedFields = currentFields.map((f: any) => f.id === id ? { ...f, [field]: value } : f);
        dispatch(updateBasics({ customFields: updatedFields }));
    };

    const removeCustomField = (id: string) => {
        // @ts-ignore
        const currentFields = resume.basics.customFields || [];
        const updatedFields = currentFields.filter((f: any) => f.id !== id);
        dispatch(updateBasics({ customFields: updatedFields }));
    };

    // Execute delete after confirmation
    const confirmDelete = () => {
        if (!deleteConfirm) return;

        switch (deleteConfirm.type) {
            case 'work':
                dispatch(deleteWorkExperience(deleteConfirm.id));
                break;
            case 'education':
                dispatch(deleteEducation(deleteConfirm.id));
                break;
            case 'skill':
                dispatch(deleteSkill(deleteConfirm.id));
                break;
            case 'project':
                dispatch(deleteProject(deleteConfirm.id));
                break;
            case 'certification':
                dispatch(deleteCertification(deleteConfirm.id));
                break;
            case 'customSection':
                dispatch(deleteCustomSection(deleteConfirm.id));
                break;
            case 'customSectionItem':
                if (deleteConfirm.sectionId) {
                    dispatch(deleteCustomSectionItem({
                        sectionId: deleteConfirm.sectionId,
                        itemId: deleteConfirm.id
                    }));
                }
                break;
        }
        setDeleteConfirm(null);
    };

    // Import Handler
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setIsImporting(true);
        try {
            const parsedData = await parseResumeFromPdf(file);

            // Update Basics
            dispatch(updateBasics({
                name: parsedData.basics.name || resume.basics.name,
                email: parsedData.basics.email || resume.basics.email,
                phone: parsedData.basics.phone || resume.basics.phone,
                summary: parsedData.basics.summary || resume.basics.summary,
            }));

            // We could also populate sections if the parser was more advanced.
            // For now, we focus on filling the basics to give the user a head start.

            alert('Resume imported successfully! Please review and edit the details.');
        } catch (error) {
            console.error(error);
            alert('Failed to parse PDF. Please try again or fill manually.');
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                            <span className="text-3xl">📄</span> MyResume
                        </h1>
                        <p className="text-sm text-gray-600">Create your professional resume in real-time</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".pdf"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={handleImportClick}
                            disabled={isImporting}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg md:text-sm text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import PDF'}</span>
                        </button>
                        <a
                            href="https://github.com/gauravsingh0001"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                            title="View on GitHub"
                        >
                            <Github size={20} />
                            <span className="hidden lg:inline">Built by Gaurav</span>
                        </a>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {showForm ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Form Panel */}
                <div
                    className={`${showForm ? 'block' : 'hidden'
                        } lg:block w-full lg:w-1/2 overflow-y-auto bg-white border-r border-gray-200`}
                >
                    <div className="p-6">
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Personal Info Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('basics')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                                    <span className="text-gray-400">{expandedSections.basics ? '−' : '+'}</span>
                                </button>

                                {expandedSections.basics && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={resume.basics.name}
                                                onChange={(e) => {
                                                    dispatch(updateBasics({ name: e.target.value }));
                                                    if (e.target.value.trim()) setNameError('');
                                                }}
                                                onBlur={() => {
                                                    if (!resume.basics.name.trim()) {
                                                        setNameError('Full name is required');
                                                    }
                                                }}
                                                maxLength={100}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 ${nameError ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="John Doe"
                                                required
                                            />
                                            {nameError && (
                                                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                                    <AlertTriangle size={14} />
                                                    <span>{nameError}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* BUG FIX #2: Email with validation */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={resume.basics.email}
                                                    onChange={(e) => {
                                                        dispatch(updateBasics({ email: e.target.value }));
                                                        validateEmail(e.target.value);
                                                    }}
                                                    onBlur={(e) => validateEmail(e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 ${emailError ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="john@example.com"
                                                />
                                                {emailError && (
                                                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                                        <AlertTriangle size={14} />
                                                        <span>{emailError}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone with validation */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                                    Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={resume.basics.phone}
                                                    onChange={(e) => {
                                                        dispatch(updateBasics({ phone: e.target.value }));
                                                        validatePhone(e.target.value);
                                                    }}
                                                    onBlur={(e) => validatePhone(e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 ${phoneError ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="+1 234 567 8900"
                                                />
                                                {phoneError && (
                                                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                                        <AlertTriangle size={14} />
                                                        <span>{phoneError}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={resume.basics.location}
                                                    onChange={(e) => dispatch(updateBasics({ location: e.target.value }))}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900"
                                                    placeholder="City, State"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                                    LinkedIn/Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={resume.basics.url}
                                                    onChange={(e) => dispatch(updateBasics({ url: e.target.value }))}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900"
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                />
                                            </div>
                                        </div>

                                        {/* Custom Fields (Portfolio, GitHub, etc.) */}
                                        <div className="space-y-3 pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-900">Additional Links</label>
                                                <button
                                                    onClick={addCustomField}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    <Plus size={14} /> Add Link
                                                </button>
                                            </div>
                                            {/* @ts-ignore */}
                                            {(resume.basics.customFields || []).map((field: any) => (
                                                <div key={field.id} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={field.name}
                                                        onChange={(e) => updateCustomField(field.id, 'name', e.target.value)}
                                                        placeholder="Label (e.g. GitHub)"
                                                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={field.value}
                                                        onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                                        placeholder="URL / Text"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => removeCustomField(field.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Remove field"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                Professional Summary
                                            </label>
                                            <textarea
                                                value={resume.basics.summary}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 500) {
                                                        dispatch(updateBasics({ summary: e.target.value }));
                                                    }
                                                }}
                                                rows={4}
                                                maxLength={500}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all bg-white text-gray-900"
                                                placeholder="Brief professional summary highlighting your key skills and experience..."
                                            />
                                            <p className={`text-xs mt-1 ${resume.basics.summary.length > 450 ? 'text-orange-600' : 'text-gray-500'
                                                }`}>
                                                {resume.basics.summary.length}/500 characters
                                                {resume.basics.summary.length > 450 && ' (approaching limit)'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Work Experience Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('work')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                                    <span className="text-gray-400">{expandedSections.work ? '−' : '+'}</span>
                                </button>

                                {expandedSections.work && (
                                    <div className="space-y-4">
                                        {resume.work.map((job: WorkExperience, index: number) => (
                                            <div key={job.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-800">Job #{index + 1}</span>
                                                    </div>
                                                    {/* BUG FIX #4: Delete with confirmation */}
                                                    <button
                                                        onClick={() => handleDelete('work', job.id, `${job.position} at ${job.company}`)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete this job"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={job.position}
                                                            onChange={(e) =>
                                                                dispatch(updateWorkExperience({ id: job.id, data: { position: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Job Title"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.company}
                                                            onChange={(e) =>
                                                                dispatch(updateWorkExperience({ id: job.id, data: { company: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Company Name"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <input
                                                            type="text"
                                                            value={job.location}
                                                            onChange={(e) =>
                                                                dispatch(updateWorkExperience({ id: job.id, data: { location: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Location"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.startDate}
                                                            onChange={(e) =>
                                                                dispatch(updateWorkExperience({ id: job.id, data: { startDate: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Start Date"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={job.endDate}
                                                            onChange={(e) =>
                                                                dispatch(updateWorkExperience({ id: job.id, data: { endDate: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="End Date"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-900 mb-1">
                                                            Highlights (one per line)
                                                        </label>
                                                        <textarea
                                                            value={job.highlights.join('\n')}
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    updateWorkExperience({ id: job.id, data: { highlights: e.target.value.split('\n') } })
                                                                )
                                                            }
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                                            placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addWorkExperience({
                                                        id: Date.now().toString(),
                                                        company: '',
                                                        position: '',
                                                        location: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        highlights: [''],
                                                    })
                                                )
                                            }
                                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Work Experience
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Education Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('education')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                                    <span className="text-gray-400">{expandedSections.education ? '−' : '+'}</span>
                                </button>

                                {expandedSections.education && (
                                    <div className="space-y-4">
                                        {resume.education.map((edu: Education, index: number) => (
                                            <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-800">Education #{index + 1}</span>
                                                    </div>
                                                    {/* BUG FIX #4: Delete with confirmation */}
                                                    <button
                                                        onClick={() => handleDelete('education', edu.id, `${edu.degree} from ${edu.institution}`)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete this education"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={edu.institution}
                                                            onChange={(e) =>
                                                                dispatch(updateEducation({ id: edu.id, data: { institution: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Institution Name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={edu.degree}
                                                            onChange={(e) => dispatch(updateEducation({ id: edu.id, data: { degree: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Degree"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={edu.field}
                                                            onChange={(e) => dispatch(updateEducation({ id: edu.id, data: { field: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Field of Study"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={edu.location}
                                                            onChange={(e) =>
                                                                dispatch(updateEducation({ id: edu.id, data: { location: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Location"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <input
                                                            type="text"
                                                            value={edu.startDate}
                                                            onChange={(e) =>
                                                                dispatch(updateEducation({ id: edu.id, data: { startDate: e.target.value } }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Start Year"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={edu.endDate}
                                                            onChange={(e) => dispatch(updateEducation({ id: edu.id, data: { endDate: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="End Year"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={edu.gpa || ''}
                                                            onChange={(e) => dispatch(updateEducation({ id: edu.id, data: { gpa: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="GPA (optional)"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addEducation({
                                                        id: Date.now().toString(),
                                                        institution: '',
                                                        degree: '',
                                                        field: '',
                                                        location: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        gpa: '',
                                                    })
                                                )
                                            }
                                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Education
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Skills Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('skills')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                                    <span className="text-gray-400">{expandedSections.skills ? '−' : '+'}</span>
                                </button>

                                {expandedSections.skills && (
                                    <div className="space-y-4">
                                        {resume.skills.map((skill: Skill, index: number) => (
                                            <div key={skill.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-800">Skill Category #{index + 1}</span>
                                                    </div>
                                                    {/* BUG FIX #4: Delete with confirmation */}
                                                    <button
                                                        onClick={() => handleDelete('skill', skill.id, skill.category)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete this skill category"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={skill.category}
                                                        onChange={(e) => dispatch(updateSkill({ id: skill.id, data: { category: e.target.value } }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                        placeholder="Category (e.g., Programming Languages)"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={skill.skills.join(', ')}
                                                        onChange={(e) =>
                                                            dispatch(
                                                                updateSkill({
                                                                    id: skill.id,
                                                                    data: { skills: e.target.value.split(',').map((s) => s.trim()) },
                                                                })
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                        placeholder="Skills (comma-separated: JavaScript, Python, React)"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addSkill({
                                                        id: Date.now().toString(),
                                                        category: '',
                                                        skills: [],
                                                    })
                                                )
                                            }
                                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Skill Category
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Projects Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('projects')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                                    <span className="text-gray-400">{expandedSections.projects ? '−' : '+'}</span>
                                </button>

                                {expandedSections.projects && (
                                    <div className="space-y-4">
                                        {resume.projects.map((project: Project, index: number) => (
                                            <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-800">Project #{index + 1}</span>
                                                    </div>
                                                    {/* BUG FIX #4: Delete with confirmation */}
                                                    <button
                                                        onClick={() => handleDelete('project', project.id, project.name)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete this project"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={project.name}
                                                            onChange={(e) => dispatch(updateProject({ id: project.id, data: { name: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Project Name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={project.date}
                                                            onChange={(e) => dispatch(updateProject({ id: project.id, data: { date: e.target.value } }))}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                            placeholder="Date"
                                                        />
                                                    </div>

                                                    <textarea
                                                        value={project.description}
                                                        onChange={(e) =>
                                                            dispatch(updateProject({ id: project.id, data: { description: e.target.value } }))
                                                        }
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                                        placeholder="Project description"
                                                    />

                                                    <textarea
                                                        value={project.highlights.join('\n')}
                                                        onChange={(e) =>
                                                            dispatch(updateProject({ id: project.id, data: { highlights: e.target.value.split('\n') } }))
                                                        }
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                                        placeholder="Highlights (one per line)"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addProject({
                                                        id: Date.now().toString(),
                                                        name: '',
                                                        description: '',
                                                        date: '',
                                                        highlights: [''],
                                                    })
                                                )
                                            }
                                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Project
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Certifications Section */}
                            <section className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleSection('certifications')}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                                    <span className="text-gray-400">{expandedSections.certifications ? '−' : '+'}</span>
                                </button>

                                {expandedSections.certifications && (
                                    <div className="space-y-4">
                                        {resume.certifications.map((cert: Certification, index: number) => (
                                            <div key={cert.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-800">Certification #{index + 1}</span>
                                                    </div>
                                                    {/* BUG FIX #4: Delete with confirmation */}
                                                    <button
                                                        onClick={() => handleDelete('certification', cert.id, cert.name)}
                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                        title="Delete this certification"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={cert.name}
                                                        onChange={(e) =>
                                                            dispatch(updateCertification({ id: cert.id, data: { name: e.target.value } }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                        placeholder="Certification Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={cert.issuer}
                                                        onChange={(e) =>
                                                            dispatch(updateCertification({ id: cert.id, data: { issuer: e.target.value } }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                        placeholder="Issuing Organization"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addCertification({
                                                        id: Date.now().toString(),
                                                        name: '',
                                                        issuer: '',
                                                    })
                                                )
                                            }
                                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Certification
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Custom Sections */}
                            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Plus size={20} className="text-blue-600" />
                                    Custom Sections
                                </h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Add Achievements, Awards, Publications, Languages, Volunteer Work, etc.
                                </p>

                                <div className="space-y-6">
                                    {/* Existing Custom Sections */}
                                    {resume.customSections && resume.customSections.map((section: any) => (
                                        <div key={section.id} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={() => toggleSection(section.id)}
                                                    className="flex-1 flex items-center justify-between"
                                                >
                                                    <input
                                                        type="text"
                                                        value={section.title}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(updateCustomSectionTitle({ id: section.id, title: e.target.value }));
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                                                        placeholder="Section Title"
                                                    />
                                                    <span className="text-gray-400 ml-2">
                                                        {expandedSections[section.id] ? '−' : '+'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete('customSection', section.id, section.title)}
                                                    className="ml-4 text-red-500 hover:text-red-700 p-1 transition-colors"
                                                    title="Delete section"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {expandedSections[section.id] && (
                                                <div className="space-y-4">
                                                    {section.items.map((item: any, index: number) => (
                                                        <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <GripVertical size={16} className="text-gray-400" />
                                                                    <span className="text-sm font-medium text-gray-800">
                                                                        Item #{index + 1}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete('customSectionItem', item.id, item.title, section.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                                    title="Delete item"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <input
                                                                        type="text"
                                                                        value={item.title}
                                                                        onChange={(e) =>
                                                                            dispatch(updateCustomSectionItem({
                                                                                sectionId: section.id,
                                                                                itemId: item.id,
                                                                                data: { title: e.target.value }
                                                                            }))
                                                                        }
                                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                                        placeholder="Title"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={item.date || ''}
                                                                        onChange={(e) =>
                                                                            dispatch(updateCustomSectionItem({
                                                                                sectionId: section.id,
                                                                                itemId: item.id,
                                                                                data: { date: e.target.value }
                                                                            }))
                                                                        }
                                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                                        placeholder="Date (optional)"
                                                                    />
                                                                </div>

                                                                <input
                                                                    type="text"
                                                                    value={item.subtitle || ''}
                                                                    onChange={(e) =>
                                                                        dispatch(updateCustomSectionItem({
                                                                            sectionId: section.id,
                                                                            itemId: item.id,
                                                                            data: { subtitle: e.target.value }
                                                                        }))
                                                                    }
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                                                    placeholder="Subtitle (optional)"
                                                                />

                                                                <textarea
                                                                    value={item.description || ''}
                                                                    onChange={(e) =>
                                                                        dispatch(updateCustomSectionItem({
                                                                            sectionId: section.id,
                                                                            itemId: item.id,
                                                                            data: { description: e.target.value }
                                                                        }))
                                                                    }
                                                                    rows={2}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                                                    placeholder="Description (optional)"
                                                                />

                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-900 mb-1">
                                                                        Details (one per line, optional)
                                                                    </label>
                                                                    <textarea
                                                                        value={(item.details || []).join('\n')}
                                                                        onChange={(e) =>
                                                                            dispatch(updateCustomSectionItem({
                                                                                sectionId: section.id,
                                                                                itemId: item.id,
                                                                                data: { details: e.target.value.split('\n').filter((d: string) => d.trim()) }
                                                                            }))
                                                                        }
                                                                        rows={3}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                                                        placeholder="• Detail 1&#10;• Detail 2&#10;• Detail 3"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <button
                                                        onClick={() =>
                                                            dispatch(addCustomSectionItem({
                                                                sectionId: section.id,
                                                                item: {
                                                                    id: Date.now().toString(),
                                                                    title: '',
                                                                    subtitle: '',
                                                                    date: '',
                                                                    description: '',
                                                                    details: []
                                                                }
                                                            }))
                                                        }
                                                        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={16} />
                                                        Add Item to {section.title}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Quick Add Buttons */}
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Quick Add:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Achievements', 'Awards', 'Publications', 'Languages', 'Volunteer Work', 'Hobbies'].map((sectionName) => (
                                                <button
                                                    key={sectionName}
                                                    onClick={() => {
                                                        const id = Date.now().toString();
                                                        dispatch(addCustomSection({ id, title: sectionName }));
                                                        setExpandedSections(prev => ({ ...prev, [id]: true }));
                                                    }}
                                                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-medium"
                                                >
                                                    + {sectionName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Section Name Input */}
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Or create your own:</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                id="customSectionName"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
                                                placeholder="Enter section name (e.g., Volunteer Experience)"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const input = e.target as HTMLInputElement;
                                                        if (input.value.trim()) {
                                                            const id = Date.now().toString();
                                                            dispatch(addCustomSection({ id, title: input.value.trim() }));
                                                            setExpandedSections(prev => ({ ...prev, [id]: true }));
                                                            input.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById('customSectionName') as HTMLInputElement;
                                                    if (input && input.value.trim()) {
                                                        const id = Date.now().toString();
                                                        dispatch(addCustomSection({ id, title: input.value.trim() }));
                                                        setExpandedSections(prev => ({ ...prev, [id]: true }));
                                                        input.value = '';
                                                    }
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className={`${showForm ? 'hidden' : 'block'} lg:block w-full lg:w-1/2`}>
                    <ResumePreview resume={resume} />
                </div>
            </div >

            {/* Delete Confirmation Modal */}
            {
                deleteConfirm?.show && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        style={{ zIndex: 9999 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setDeleteConfirm(null);
                        }}
                    >
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                            </div>

                            <p className="text-gray-600 mb-2">Are you sure you want to delete:</p>
                            <p className="font-semibold text-gray-900 mb-1">"{deleteConfirm.name}"?</p>
                            <p className="text-sm text-red-600 mb-6">⚠️ This action cannot be undone.</p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default function ResumeBuilderPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 font-medium">Loading your resume...</p>
                </div>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <ResumeBuilderContent />
        </Provider>
    );
}
