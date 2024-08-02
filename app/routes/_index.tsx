import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'New Remix App' },
  { name: 'description', content: 'Welcome to Remix!' }
];

const Index = () => (
  <div className="p-4 font-sans">
    <h1 className="text-3xl">Home</h1>
  </div>
);

export default Index;
