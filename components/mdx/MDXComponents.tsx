import Callout from './Callout';
import Card from './Card';
import Tabs from './Tabs';

export const MDXComponents = {
  Callout,
  Card,
  Tabs,
  // Enhanced default HTML elements
  h1: (props: any) => (
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 scroll-mt-20" id={props.id} {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 scroll-mt-20" id={props.id} {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 scroll-mt-20" id={props.id} {...props} />
  ),
  p: (props: any) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-outside text-gray-700 dark:text-gray-300 space-y-2 my-4 ml-6" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-outside text-gray-700 dark:text-gray-300 space-y-2 my-4 ml-6" {...props} />
  ),
  li: (props: any) => (
    <li className="text-gray-700 dark:text-gray-300 pl-2" {...props} />
  ),
  a: (props: any) => (
    <a className="text-primary-600 dark:text-primary-400 hover:underline" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  code: (props: any) => (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-200" {...props} />
  ),
  pre: (props: any) => (
    <pre className="my-4 p-4 rounded-lg bg-gray-900 dark:bg-gray-950 overflow-x-auto" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400" {...props} />
  ),
};
