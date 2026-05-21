import { NextRequest, NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/resume/ResumePDF';
import { Resume } from '@/types/resume';
import React from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Use Node.js runtime for better compatibility
// Force Vercel to pick up latest changes

export async function POST(request: NextRequest) {
    try {
        const resume: Resume = await request.json();

        // Validate resume data
        if (!resume || !resume.basics || !resume.basics.name) {
            return NextResponse.json(
                { error: 'Invalid resume data' },
                { status: 400 }
            );
        }

        // Generate PDF buffer
        // ResumePDF returns a Document, so we can pass it directly to pdf()
        const pdfElement = React.createElement(ResumePDF, { resume });
        const pdfDoc = pdf(pdfElement as any); // Type assertion needed for server-side rendering

        // Convert to blob first, then to array buffer for NextResponse
        const blob = await pdfDoc.toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Return PDF as response
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${resume.basics.name.replace(/\s+/g, '_')}_Resume.pdf"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
