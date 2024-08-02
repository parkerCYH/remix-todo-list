import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { MetaFunction } from '@remix-run/node';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const meta: MetaFunction = () => [
  { title: 'Todo List | Remix Todo List' },
  {
    name: 'description',
    content: 'Remix Todo List! Todo List Page!'
  }
];

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createAt: number;
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    const newTask: Todo = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      createAt: Date.now()
    };
    setTodos([...todos, newTask]);
    setNewTodo('');
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="p-4 font-sans">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <Button onClick={handleAddTodo}>
          <Plus className="mr-2" />
          Add
        </Button>
      </div>
      <ul className="list-inside list-disc">
        <TableDemo
          todos={todos}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTodo={handleDeleteTodo}
        />
      </ul>
    </div>
  );
};

const TableDemo = ({
  todos,
  handleToggleComplete,
  handleDeleteTodo
}: {
  todos: Todo[];
  handleToggleComplete: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
}) => (
  <Table>
    <TableCaption>A list of your recent todos.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>{todos.length} Todo(s)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {todos.map(({ id, text, completed, createAt }) => (
        <TableRow key={id}>
          <TableCell onClick={() => handleToggleComplete(id)} className="cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={clsx(completed && 'line-through')}>{text}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(createAt).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="link"
              onClick={() => handleDeleteTodo(id)}
              className="ml-2 text-red-500"
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export default TodoList;
