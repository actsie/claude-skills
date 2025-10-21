'use client';

import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FAQContent {
  intro?: string;
  points: string[];
}

interface FAQItem {
  question: string;
  content: FAQContent;
}

const faqs: FAQItem[] = [
  {
    question: 'What are Skills?',
    content: {
      intro: 'Skills are specialized packages of instructions, scripts, and resources that you can give to Claude.',
      points: [
        'You can think of creating a Skill as being like putting together an onboarding guide for a new hire. They transform Claude from a general-purpose agent into a specialized agent that meets your specific needs.',
        'Skills package your expertise into composable resources that extend Claude\'s capabilities.',
      ],
    },
  },
  {
    question: 'What can Skills help Claude do?',
    content: {
      intro: 'Skills equip Claude with specialized capabilities necessary for real-world tasks that require procedural knowledge and organizational context.',
      points: [
        'They make Claude better at specialized tasks, such as working with Microsoft Excel, following your organization\'s brand guidelines, or handling specific document types.',
        'Skills can provide specialized workflows (multi-step procedures), tool integrations (instructions for specific APIs or file formats), and domain expertise (company policies or schemas).',
        'For example, Skills power Claude\'s ability to create and manipulate files like spreadsheets, presentations, and fillable PDFs.',
      ],
    },
  },
  {
    question: 'How does Claude know when to use a Skill?',
    content: {
      intro: 'Claude loads Skills dynamically when they are relevant to the task you are asking it to complete.',
      points: [
        'When you give Claude a task, it scans the available Skills to find matches.',
        'Claude only accesses a Skill when it determines that it is relevant to the task at hand.',
        'To stay efficient, Claude uses a principle called progressive disclosure: First, it pre-loads the Skill\'s name and description (metadata) to know when the Skill might be useful. If the Skill seems relevant, Claude loads the core instructions. Claude loads additional resources (like specific scripts or reference files) only if and when they are needed for the task.',
      ],
    },
  },
  {
    question: 'What are Skills made of?',
    content: {
      intro: 'Skills are fundamentally very simple in format.',
      points: [
        'A Skill is primarily a directory (folder) that contains a required file called SKILL.md.',
        'The SKILL.md file contains the instructions Claude will follow.',
        'Skills can also bundle additional, optional files within the skill directory, which are referenced by name from SKILL.md. These bundled resources can include scripts (executable code), references (documentation and reference materials), and assets (files used in the output, such as templates, logos, or images).',
      ],
    },
  },
  {
    question: 'Can Skills include code?',
    content: {
      intro: 'Yes, Skills can include code for Claude to execute as tools.',
      points: [
        'While large language models are good at many things, certain operations (like sorting a list or performing specific deterministic tasks) are better handled by traditional code execution.',
        'For example, a PDF Skill might include a pre-written Python script to extract all form fields from a PDF.',
        'Because code execution requires a secure environment, Skills depend on Claude having access to a secure coding environment.',
      ],
    },
  },
  {
    question: 'Where can I use Skills?',
    content: {
      intro: 'Agent Skills are supported across the Claude ecosystem.',
      points: [
        'Skills are available in Claude apps (for Pro, Max, Team, and Enterprise users).',
        'They are supported in Claude Code and the Claude Developer Platform (API).',
      ],
    },
  },
  {
    question: 'How simple is it to create a Skill?',
    content: {
      intro: 'The concept and format of Skills are simple, making them easier for organizations, developers, and end users to build customized agents.',
      points: [
        'Creating a basic Skill can be as simple as making a folder with a SKILL.md file containing metadata (name and description) and instructions.',
        'Claude can even help you create and edit Skills using a specific guidance tool called the "skill-creator" skill, which asks about your workflow and generates the necessary files.',
      ],
    },
  },
  {
    question: 'Should I be careful about which Skills I use?',
    content: {
      intro: 'Yes, because Skills can provide instructions and code for Claude to execute, it is important to be mindful of security.',
      points: [
        'You should only install Skills from trusted sources.',
        'A malicious Skill could potentially introduce vulnerabilities or instruct Claude to take unintended actions, such as removing data.',
      ],
    },
  },
];

const resources = [
  {
    title: 'Official Skills Documentation',
    href: 'https://www.anthropic.com/news/skills',
    description: 'Learn about Skills from Anthropic',
  },
  {
    title: 'How to Create a Skill',
    href: 'https://github.com/anthropics/skills/blob/main/skill-creator/SKILL.md',
    description: 'Step-by-step guide to building Skills',
  },
  {
    title: 'Submit Your Own Skill',
    href: 'https://github.com/anthropics/skills',
    description: 'Share your Skills with the community',
  },
  {
    title: 'Watch Tutorial',
    href: 'https://www.youtube.com/watch?v=kS1MJFZWMq4',
    description: 'Video guide to using Skills',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EBE5FD] dark:bg-[#362B6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F8F6FE] dark:bg-[#191046] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column - Resources */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Learn more and get started with Claude Skills
            </p>

            <div className="space-y-4">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#7866CC] dark:group-hover:text-[#AF97F8] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#7866CC] dark:text-[#AF97F8] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - FAQ */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Everything you need to know about Skills
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 border rounded-lg overflow-hidden transition-all duration-200 ${
                    openIndex === index
                      ? 'border-[#7866CC] dark:border-[#AF97F8] shadow-lg shadow-[#EBE5FD]/50 dark:shadow-[#362B6B]/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#D7CBFC] dark:hover:border-[#5E50A0]'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left group"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100 pr-6 group-hover:text-[#7866CC] dark:group-hover:text-[#AF97F8] transition-colors">
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                      openIndex === index
                        ? 'bg-[#7866CC] dark:bg-[#AF97F8]'
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-[#EBE5FD] dark:group-hover:bg-[#362B6B]'
                    }`}>
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-200 ${
                          openIndex === index
                            ? 'rotate-180 text-white dark:text-gray-900'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                    </div>
                  </button>

                  {openIndex === index && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                        {faq.content.intro && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.content.intro}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {faq.content.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#7866CC] dark:bg-[#AF97F8] mt-1.5"></span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
