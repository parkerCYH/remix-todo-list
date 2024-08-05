import { json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';
import { Plus } from 'lucide-react';
import type { MetaFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
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
import { createTodo, deleteTodo, getTodos, updateTodo } from '@/data';

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

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  if (!todos) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ todos });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('_action');
  const id = formData.get('id') as string;

  if (actionType === 'add') {
    const text = formData.get('text') as string;
    if (text.trim() === '') return null;
    createTodo({
      text
    });
  } else if (actionType === 'toggle') {
    updateTodo(id, { completed: true });
  } else if (actionType === 'delete') {
    deleteTodo(id);
  }

  return redirect('/todo-list');
};

const TodoList = () => {
  const { todos } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isAdding = navigation.formData?.get('_action') === 'add';

  return (
    <div className="p-4 font-sans">
      <Form method="post" className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" name="text" placeholder="Add a new task" />
        <Button type="submit" name="_action" value="add" disabled={isAdding}>
          <Plus className="mr-2" />
          Add
        </Button>
      </Form>
      <ul className="list-inside list-disc">
        <TableDemo todos={todos} />
      </ul>
    </div>
  );
};

const TableDemo = ({ todos }: { todos: Todo[] }) => (
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
          <TableCell className="cursor-pointer">
            <Form method="post">
              <input type="hidden" name="id" value={id} />
              <button type="submit" name="_action" value="toggle">
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
              </button>
            </Form>
          </TableCell>
          <TableCell className="text-right">
            <Form method="post">
              <input type="hidden" name="id" value={id} />
              <Button type="submit" name="_action" value="delete" className="ml-2 text-red-500">
                Delete
              </Button>
            </Form>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default TodoList;
