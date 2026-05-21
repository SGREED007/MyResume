'use client';

import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';
import { Resume } from '@/types/resume';
import { Download, ZoomIn, ZoomOut, Loader2, Maximize } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ResumePreviewProps {
    resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
    const [zoom, setZoom] = useState(100);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [previousPdfUrl, setPreviousPdfUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

    const handleFitToScreen = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            // 816px is the width of the A4 page. 48px is approx padding (3rem).
            // We clamp between 50 and 150 to stay within slider bounds.
            const fitZoom = Math.min(Math.max(Math.floor(((containerWidth - 48) / 816) * 100), 50), 150);
            setZoom(fitZoom);
        }
    };

    // Handle PDF download via API route (server-side generation for Vercel compatibility)
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resume),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Get the PDF blob from response
            const blob = await response.blob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resume.basics.name.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Generate PDF blob URL whenever resume changes (for preview only)
    useEffect(() => {
        // Debounce PDF generation to avoid too many updates
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                setIsGenerating(true);

                // Generate PDF blob
                const blob = await pdf(<ResumePDF resume={resume} />).toBlob();

                // Keep previous URL for smooth transition
                if (pdfUrl) {
                    setPreviousPdfUrl(pdfUrl);
                }

                // Create new blob URL
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);

                // Clean up previous URL after transition
                setTimeout(() => {
                    if (previousPdfUrl) {
                        URL.revokeObjectURL(previousPdfUrl);
                        setPreviousPdfUrl('');
                    }
                }, 500);

                // Note: We don't set isGenerating(false) here immediately.
                // We wait for the iframe to trigger onLoad to prevent black screen flash.
            } catch (error) {
                console.error('Error generating PDF:', error);
                setIsGenerating(false);
            }
        }, 300); // 300ms debounce

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [resume]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            if (previousPdfUrl) {
                URL.revokeObjectURL(previousPdfUrl);
            }
        };
    }, [pdfUrl, previousPdfUrl]);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700">PDF Preview</h3>
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {isGenerating ? (
                            <>
                                <Loader2 size={12} className="animate-spin" />
                                Updating
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Live
                            </>
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-white">
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 50}
                            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom Out"
                            aria-label="Zoom out"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <span className="text-sm font-medium min-w-[50px] text-center">{zoom}%</span>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 150}
                            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom In"
                            aria-label="Zoom in"
                        >
                            <ZoomIn size={16} />
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button
                            onClick={handleFitToScreen}
                            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
                            title="Fit to Screen"
                            aria-label="Fit to screen"
                        >
                            <Maximize size={16} />
                        </button>
                    </div>

                    {/* Download Button - Now uses API route for server-side generation */}
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* PDF Viewer with smooth transition */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100" ref={containerRef}>
                <div
                    className="mx-auto bg-white shadow-lg transition-transform duration-200 relative"
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top center',
                        width: '816px', // A4 width at 96 DPI
                    }}
                >
                    {/* Loading overlay during generation - covers black screen */}
                    {isGenerating && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 transition-opacity duration-200">
                            <div className="text-center">
                                <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Updating preview...</p>
                            </div>
                        </div>
                    )}

                    {pdfUrl ? (
                        <iframe
                            ref={iframeRef}
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full border-none"
                            onLoad={() => setIsGenerating(false)}
                            style={{
                                height: '1056px', // A4 height at 96 DPI
                                backgroundColor: 'white',
                            }}
                            title="Resume PDF Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[1056px] bg-white">
                            <div className="text-center">
                                <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">Generating PDF...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
