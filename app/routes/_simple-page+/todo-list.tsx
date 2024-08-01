import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Todo List | Remix Todo List" },
    {
      name: "description",
      content: "Remix Todo List! Todo List Page!",
    },
  ];
};

export default function TodoList() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Todo List</h1>
    </div>
  );
}
