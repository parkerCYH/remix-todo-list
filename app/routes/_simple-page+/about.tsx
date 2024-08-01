import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "About | Remix Todo List" },
    {
      name: "description",
      content: "Remix Todo List! About Page!",
    },
  ];
};

export default function About() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">About me</h1>
    </div>
  );
}
