import Link from 'next/link';
import { FileText, Zap, Download, Shield, Sparkles, ArrowRight, Github, Linkedin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Shield size={16} />
            <span>100% Free • Privacy-First • No Sign-up Required</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your Professional Resume
            <span className="block text-blue-600 mt-2">In Minutes, Not Hours</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create ATS-friendly resumes with our powerful builder. Real-time preview,
            professional templates, and instant PDF export. All in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/resume-builder"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <FileText className="mr-2" size={20} />
              Create Resume Now
            </Link>
            <Link
              href="/resume-builder"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-lg font-semibold"
            >
              View Example
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Free Forever</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">ATS</div>
              <div className="text-sm text-gray-600">Optimized</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Sign-up Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MyResume?</h2>
          <p className="text-lg text-gray-600">Everything you need to create a winning resume</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Preview</h3>
            <p className="text-gray-600">
              See your resume update instantly as you type. No waiting, no loading screens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant PDF Export</h3>
            <p className="text-gray-600">
              Download your professional resume as a PDF with a single click. Ready to apply.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Private</h3>
            <p className="text-gray-600">
              Your data stays in your browser. No servers, no tracking, complete privacy.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple 3-Step Process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Details</h3>
              <p className="text-gray-600">
                Fill in your information using our easy-to-use form interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize & Preview</h3>
              <p className="text-gray-600">
                Watch your resume come to life with real-time updates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Apply</h3>
              <p className="text-gray-600">
                Export as PDF and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Resume?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've created professional resumes in minutes
          </p>
          <Link
            href="/resume-builder"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            <FileText className="mr-2" size={20} />
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-900 font-medium mb-2 text-lg">
            Built with ❤️ by <a href="https://linkedin.com/in/gauravsinghdev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Gaurav Singh</a>
          </p>

          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://github.com/gauravsingh0001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/gauravsinghdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 Gaurav Singh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
