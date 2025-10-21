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

type SubmissionStep = 'github' | 'success';

export default function SubmitSkillModal({ isOpen, onClose }: SubmitSkillModalProps) {
  const [step, setStep] = useState<SubmissionStep>('github');
  const [githubLink, setGithubLink] = useState('');
  const [error, setError] = useState('');
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
    setStep('github');
    setGithubLink('');
    setError('');
    onClose();
  };

  const validateGithubUrl = (url: string): boolean => {
    // Match GitHub repository URLs in various formats
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url.trim());
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!githubLink.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGithubUrl(githubLink)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)');
      return;
    }

    try {
      const response = await fetch('https://discord.com/api/webhooks/1430129322353754256/lUkfcaO3CyEMSD85n3c5Da0m1UINhKv_pI5bGv2kdacxDEx4ZPxAdUXRqK1_S-Q44f2a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `**New Skill Submission**\n\n` +
            `**GitHub Repository:** ${githubLink}\n` +
            `**Submitted at:** ${new Date().toLocaleString()}`
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        setError('There was an error submitting your skill. Please try again.');
      }
    } catch (error) {
      console.error('GitHub submission error:', error);
      setError('There was an error submitting your skill. Please try again.');
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
          {step === 'github' && (
            <form onSubmit={handleGithubSubmit} className="space-y-4">
              <div className="bg-[#F8F6FE] dark:bg-purple-900/20 border border-[#EBE5FD] dark:border-purple-800 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-[#5E50A0] dark:text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                      Submit your skill by providing the GitHub repository URL. Make sure your repository includes a comprehensive README.md file.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="github-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository Link
                </label>
                <Input
                  id="github-link"
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={githubLink}
                  onChange={(e) => {
                    setGithubLink(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#5E50A0] hover:bg-[#4a3d80] text-white"
              >
                Submit Skill
              </Button>
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
