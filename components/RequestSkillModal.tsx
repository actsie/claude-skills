'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RequestSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestSkillModal({ isOpen, onClose }: RequestSkillModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    skillName: '',
    skillPurpose: '',
    useCase: '',
    inputType: '',
    expectedOutput: '',
    priority: 'Medium',
    additionalContext: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data for Discord webhook
      const discordEmbed = {
        embeds: [{
          title: "🎯 New Skill Request",
          color: 0x3b82f6, // Blue color
          fields: [
            {
              name: "📧 Email",
              value: formData.email,
              inline: true
            },
            {
              name: "🔧 Skill Name",
              value: formData.skillName,
              inline: true
            },
            {
              name: "⚡ Priority",
              value: formData.priority,
              inline: true
            },
            {
              name: "📋 What should this skill do?",
              value: formData.skillPurpose || "Not specified",
              inline: false
            },
            {
              name: "💡 Example Use Case",
              value: formData.useCase || "Not specified",
              inline: false
            },
            {
              name: "📥 Input Type",
              value: formData.inputType || "Not specified",
              inline: true
            },
            {
              name: "📤 Expected Output",
              value: formData.expectedOutput || "Not specified",
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Claude Skills Market"
          }
        }]
      };

      // Add additional context if provided
      if (formData.additionalContext?.trim()) {
        discordEmbed.embeds[0].fields.push({
          name: "📝 Additional Context",
          value: formData.additionalContext,
          inline: false
        });
      }

      const response = await fetch('https://discord.com/api/webhooks/1429050546781945867/-IT_fLkKWIA5Ek11ERQgBHkLsYL-IQVH4T8-DsZIfE9S8Z9QG7egPg7rel5qW0OSDV3q', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordEmbed),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            email: '',
            skillName: '',
            skillPurpose: '',
            useCase: '',
            inputType: '',
            expectedOutput: '',
            priority: 'Medium',
            additionalContext: '',
          });
          onClose();
        }, 3000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && formData.skillName && formData.skillPurpose && formData.useCase;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8 max-h-none">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Request a New Skill
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Help us build the skill you need for your Claude workflow
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your skill request. We&apos;ll review it and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  For notifications and follow-up communication
                </p>
              </div>

              {/* Skill Name */}
              <div>
                <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name/Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="skillName"
                  name="skillName"
                  required
                  value={formData.skillName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Meeting Notes Summarizer, Resume Builder"
                />
              </div>

              {/* Skill Purpose */}
              <div>
                <label htmlFor="skillPurpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What should this skill do? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="skillPurpose"
                  name="skillPurpose"
                  required
                  rows={3}
                  value={formData.skillPurpose}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Transform meeting notes into structured summaries with action items and next steps"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Brief description of the purpose (2-3 sentences)
                </p>
              </div>

              {/* Use Case */}
              <div>
                <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Example Use Case <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="useCase"
                  name="useCase"
                  required
                  rows={4}
                  value={formData.useCase}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., I would paste my meeting transcript and say 'Please summarize this meeting with action items and next steps'"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <strong>Most important field!</strong> Describe how you would use this skill. What would you say to Claude?
                </p>
              </div>

              {/* Input Type */}
              <div>
                <label htmlFor="inputType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What input would you provide?
                </label>
                <input
                  type="text"
                  id="inputType"
                  name="inputType"
                  value={formData.inputType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Plain text notes, PDF invoices, CSV files, images"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Files, text formats, or data types (optional but helpful)
                </p>
              </div>

              {/* Expected Output */}
              <div>
                <label htmlFor="expectedOutput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What output do you expect?
                </label>
                <input
                  type="text"
                  id="expectedOutput"
                  name="expectedOutput"
                  value={formData.expectedOutput}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Markdown summary with action items checklist, Formatted report, Code files"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  What should the skill produce? (optional but helpful)
                </p>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority/Urgency
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Helps prioritize which skills to build first
                </p>
              </div>

              {/* Additional Context */}
              <div>
                <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Context
                </label>
                <textarea
                  id="additionalContext"
                  name="additionalContext"
                  rows={3}
                  value={formData.additionalContext}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any other details, special requirements, or context that would be helpful"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}