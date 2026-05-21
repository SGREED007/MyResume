# MyResume - Professional Resume Builder

A free, private, and open-source resume builder built with Next.js. Create ATS-friendly resumes with real-time preview and PDF export.

**🚀 [Live Demo](https://quickmyresume.vercel.app/)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GauravSingh0001/MyResume)

---

## ✨ Features

### Core Features
- ✅ **Real-time Preview:** See changes instantly as you type
- ✅ **Import PDF:** Upload your existing PDF resume to auto-fill details
- ✅ **Privacy First:** All data stays in your browser - no servers involved
- ✅ **ATS Friendly:** Export optimized PDFs that pass Applicant Tracking Systems
- ✅ **Auto-Save:** Your work is automatically saved to browser localStorage
- ✅ **Server-side PDF Generation:** Reliable downloads on Vercel deployment

### Resume Sections
- ✅ Personal Information with custom links (GitHub, Portfolio, etc.)
- ✅ Professional Summary
- ✅ Work Experience with highlights
- ✅ Education with GPA
- ✅ Skills (categorized)
- ✅ Projects with descriptions
- ✅ Certifications
- ✅ **Custom Sections** (Achievements, Awards, Publications, Languages, Volunteer Work, Hobbies, etc.)

### Advanced Features
- **Conditional Formatting:** Auto-alignment for optional fields
- **Smart Separators:** Automatic bar separators between contact fields
- **Validation:** Email and phone number validation
- **Delete Confirmations:** Prevent accidental deletions
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Expandable Sections:** Collapse/expand sections for better organization

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GauravSingh0001/MyResume.git
   cd MyResume/myresume-style
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

---

## 📖 How to Use

### Basic Usage

1. **Fill in Personal Information:**
   - Name, email, phone, location
   - LinkedIn/Website URL
   - Add additional links (GitHub, Portfolio, etc.)
   - Write a professional summary

2. **Add Work Experience:**
   - Click "Add Work Experience"
   - Fill in job title, company, dates
   - Add bullet points for achievements

3. **Add Education:**
   - Institution, degree, field of study
   - Dates and GPA (optional)

4. **Add Skills:**
   - Create skill categories (e.g., "Programming Languages")
   - List skills separated by commas

5. **Add Projects & Certifications:**
   - Project name, description, technologies
   - Certification name and issuer

6. **Download PDF:**
   - Click "Download PDF" button
   - Your resume will be downloaded as a professional PDF

### Using Custom Sections

**✅ Fully Integrated and Working!**

Custom sections allow you to add any additional information to your resume:

1. **Scroll to the bottom** of the resume builder form
2. **Quick Add:** Click pre-made buttons for common sections:
   - Achievements
   - Awards
   - Publications
   - Languages
   - Volunteer Work
   - Hobbies

3. **Or Create Custom:** Type your own section name and click "Create"
   - Examples: "Volunteer Experience", "Patents", "Speaking Engagements"

4. **Add Items:** Each section can have multiple items with:
   - **Title** (required)
   - **Subtitle** (optional)
   - **Date** (optional)
   - **Description** (optional)
   - **Bullet points/details** (optional - one per line)

5. **Manage Sections:**
   - Click section titles to expand/collapse
   - Edit section names inline
   - Use trash icons to delete sections or items
   - All changes auto-save

6. **PDF Export:** All custom sections automatically appear in your downloaded PDF

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[Redux Toolkit](https://redux-toolkit.js.org)** - State management

### PDF Generation
- **[@react-pdf/renderer](https://react-pdf.org)** - PDF generation
- Server-side API route for reliable Vercel deployment
- Client-side preview for real-time updates

### Other Tools
- **[Lucide React](https://lucide.dev)** - Icons
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF import parsing

---

## 📁 Project Structure

```
myresume-style/
├── app/
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts          # Server-side PDF generation
│   ├── resume-builder/
│   │   └── page.tsx              # Main resume builder page
│   └── layout.tsx
├── components/
│   └── resume/
│       ├── ResumePDF.tsx         # PDF template
│       └── ResumePreview.tsx     # PDF preview component
├── lib/
│   ├── redux/
│   │   ├── store.ts              # Redux store
│   │   ├── resumeSlice.ts        # Resume state management
│   │   └── hooks.ts              # Redux hooks
│   └── parse-resume.ts           # PDF import parser
├── types/
│   └── resume.ts                 # TypeScript interfaces
└── public/
```

---

## 🎨 Customization

### PDF Styling

Edit `components/resume/ResumePDF.tsx` to customize:

```tsx
const styles = StyleSheet.create({
    name: {
        fontSize: 18,        // Name font size
        marginBottom: 5,     // Spacing below name
    },
    contactInfo: {
        fontSize: 9,         // Contact info font size
    },
    // ... more styles
});
```

### Color Scheme

Update Tailwind classes in `app/resume-builder/page.tsx`:
- Primary color: `blue-600`
- Accent color: `indigo-600`
- Background gradients: `from-blue-50 to-indigo-50`

### Section Order

Rearrange sections in `app/resume-builder/page.tsx` by moving the `<section>` blocks.

---

## 🔧 Configuration

### Vercel Deployment

The app is configured for Vercel deployment with:
- Turbopack support
- Server-side PDF generation
- Optimized serverless functions
- 3MB payload limit for large resumes

**Environment Variables:** None required - everything runs client-side except PDF generation.

### Next.js Configuration

`next.config.ts`:
```typescript
{
    webpack: {
        resolve: {
            alias: { canvas: false }  // PDF library compatibility
        }
    },
    turbopack: {},
    experimental: {
        serverActions: {
            bodySizeLimit: '3mb'      // Large resume support
        }
    },
    serverExternalPackages: ['@react-pdf/renderer']
}
```

---

## 🐛 Troubleshooting

### PDF Download Fails
**Solution:** The app uses server-side PDF generation. If downloads fail, check:
- Network connection
- Browser console for errors
- Vercel function logs (if deployed)

### Custom Sections Not Showing
**Solution:** Custom sections are fully integrated. If not visible:
- Scroll to the bottom of the form
- Look for the blue "Custom Sections" panel
- Clear browser cache and refresh

### Data Not Persisting
**Solution:** Data is saved to localStorage. If data resets:
- Check browser privacy settings
- Ensure localStorage is enabled
- Use "Download PDF" to backup your resume

### Import PDF Not Working
**Solution:** PDF import uses basic text extraction:
- Works best with simple, text-based PDFs
- May not work with image-based or complex PDFs
- Manually verify and edit imported data

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add TypeScript types for new features
- Test on both development and production builds
- Ensure PDF export works correctly
- Update README for new features

---

## 📝 Changelog

### v2.0.0 - Latest (January 2026)
- ✅ Added custom sections feature (Achievements, Awards, etc.)
- ✅ Implemented server-side PDF generation for Vercel
- ✅ Added conditional bar separators in PDF header
- ✅ Improved spacing between name and contact info
- ✅ Enhanced delete confirmations for all sections
- ✅ Added email and phone validation
- ✅ Implemented PDF import functionality
- ✅ Auto-save to localStorage
- ✅ Responsive design improvements

### v1.0.0 - Initial Release
- Basic resume builder functionality
- Real-time PDF preview
- Download PDF feature
- Work, Education, Skills, Projects, Certifications sections

---

## 📄 License

This project is open source and available under the MIT License.

**Modified and maintained by [Gaurav Singh](https://github.com/GauravSingh0001)**

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by various open-source resume builders
- Community contributions and feedback
- [@react-pdf/renderer](https://react-pdf.org) for PDF generation

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/GauravSingh0001/MyResume/issues)
- **Discussions:** [GitHub Discussions](https://github.com/GauravSingh0001/MyResume/discussions)
- **Email:** gauravsinghdevu@gmail.com

---

## 🌟 Features Roadmap

### Completed ✅
- [x] Real-time preview
- [x] PDF download
- [x] Custom sections
- [x] PDF import
- [x] Auto-save
- [x] Vercel deployment
- [x] Server-side PDF generation

### Future Ideas 💡
- [ ] Multiple resume templates
- [ ] Export to Word/Google Docs
- [ ] AI-powered content suggestions
- [ ] Resume scoring/analysis
- [ ] Cover letter builder
- [ ] LinkedIn import
- [ ] Multi-language support

---

## 📊 Project Stats

- **Lines of Code:** ~3,500+
- **Components:** 15+
- **Redux Actions:** 30+
- **TypeScript Interfaces:** 10+
- **Supported Sections:** 7 standard + unlimited custom

---

## 🎯 Why MyResume?

### Privacy
- **100% Client-side:** Your data never leaves your browser
- **No Account Required:** Start building immediately
- **No Tracking:** We don't collect any personal information

### Quality
- **ATS Optimized:** Passes Applicant Tracking Systems
- **Professional Design:** Clean, modern layout
- **Customizable:** Add any sections you need

### Free & Open Source
- **Always Free:** No premium features or paywalls
- **Open Source:** Contribute and customize
- **Self-Hostable:** Deploy your own instance

---

**Made with ❤️ by Gaurav Singh**

⭐ If you find this project useful, please consider giving it a star on GitHub!
