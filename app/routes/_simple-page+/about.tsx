import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'About | Remix Todo List' },
  {
    name: 'description',
    content: 'Remix Todo List! About Page!'
  }
];

const About = () => (
  <div className="p-4 font-sans">
    <h1 className="text-3xl">About me</h1>
  </div>
);

export default About;
