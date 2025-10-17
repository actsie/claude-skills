'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Confetti from 'react-confetti';

interface SubmitSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionStep = 'choice' | 'github' | 'form' | 'success';

export default function SubmitSkillModal({ isOpen, onClose }: SubmitSkillModalProps) {
  const [step, setStep] = useState<SubmissionStep>('choice');
  const [githubLink, setGithubLink] = useState('');
  const [formData, setFormData] = useState({
    skillName: '',
    description: '',
    link: '',
    category: '',
    email: '',
  });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Track window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('choice');
    setGithubLink('');
    setFormData({
      skillName: '',
      description: '',
      link: '',
      category: '',
      email: '',
    });
    onClose();
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!githubLink.trim()) return;

    try {
      const response = await fetch('https://formspree.io/f/mdkwbzej', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionType: 'GitHub Link',
          githubLink: githubLink,
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        alert('There was an error submitting your skill. Please try again.');
      }
    } catch (error) {
      console.error('GitHub submission error:', error);
      alert('There was an error submitting your skill. Please try again.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://formspree.io/f/mdkwbzej', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionType: 'Detailed Form',
          ...formData,
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        alert('There was an error submitting your skill. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your skill. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Submit a Skill
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'choice' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                How would you like to submit your skill?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub Card */}
                <button
                  onClick={() => setStep('github')}
                  className="flex flex-col items-center justify-center p-6 bg-[#F8F6FE] dark:bg-purple-900/20 rounded-lg border-2 border-purple-100 dark:border-purple-800 hover:border-[#5E50A0] dark:hover:border-[#5E50A0] hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-[#5E50A0] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    Submit via GitHub
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Share a link to your GitHub repository
                  </div>
                </button>

                {/* Form Card */}
                <button
                  onClick={() => setStep('form')}
                  className="flex flex-col items-center justify-center p-6 bg-[#F8F6FE] dark:bg-purple-900/20 rounded-lg border-2 border-purple-100 dark:border-purple-800 hover:border-[#5E50A0] dark:hover:border-[#5E50A0] hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-[#5E50A0] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    Submit via Form
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Fill out the details manually
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'github' && (
            <form onSubmit={handleGithubSubmit} className="space-y-4">
              <div>
                <label htmlFor="github-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository Link
                </label>
                <Input
                  id="github-link"
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep('choice')}
                  variant="outline"
                  className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#5E50A0] hover:bg-[#4a3d80] text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}

          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="skill-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name
                </label>
                <Input
                  id="skill-name"
                  type="text"
                  placeholder="e.g., Excel Data Processor"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description
                </label>
                <textarea
                  id="description"
                  placeholder="Brief description of what your skill does"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E50A0] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link (GitHub or docs)
                </label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <Input
                  id="category"
                  type="text"
                  placeholder="e.g., productivity, development"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep('choice')}
                  variant="outline"
                  className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#5E50A0] hover:bg-[#4a3d80] text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Submission Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for your submission! We will review your skill and get back to you soon.
              </p>
              <Button
                onClick={handleClose}
                className="bg-[#5E50A0] hover:bg-[#4a3d80] text-white"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confetti */}
      {step === 'success' && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
    </div>
  );
}
