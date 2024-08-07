import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { TodoRecord } from '@/data';
import { createTodo, deleteTodo, getTodos, updateTodo } from '@/data';
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, redirect, useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
import { Plus } from 'lucide-react';
import type { FunctionComponent } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Todo List | Remix Todo List' },
  {
    name: 'description',
    content: 'Remix Todo List! Todo List Page!'
  }
];

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  if (!todos) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ todos });
};

const INTENT_ADD_TASK = 'add';
const INTENT_DELETE_TASK = 'delete';
const INTENT_UPDATE_TASK = 'update';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case INTENT_ADD_TASK: {
      return createTodo(formData);
    }
    case INTENT_UPDATE_TASK: {
      return updateTodo(formData);
    }
    case INTENT_DELETE_TASK: {
      await deleteTodo(formData);
      return redirect('/todo-list');
    }
    default: {
      throw new Response(`Invalid intent "${intent}"`, { status: 400 });
    }
  }
};

const TodoList = () => {
  const { todos } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="p-4 font-sans">
      <Form method="post" className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" name="text" placeholder="Add a new task" />
        <Button
          type="submit"
          name="intent"
          value={INTENT_ADD_TASK}
          disabled={navigation.state === 'loading'}
        >
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

const TableDemo = ({ todos }: { todos: TodoRecord[] }) => (
  <Table>
    <TableCaption>A list of your recent todos.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>{todos.length} Todo(s)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {todos.map((todo) => (
        <TodoRow todo={todo} key={todo.id} />
      ))}
    </TableBody>
  </Table>
);

const TodoRow: FunctionComponent<{
  todo: TodoRecord;
  key: string;
}> = ({ todo, key }) => {
  const fetcher = useFetcher();
  const completed = fetcher.formData
    ? fetcher.formData.get('completed') === 'true'
    : todo.completed;
  const { id, createdAt, text } = todo;
  return (
    <TableRow key={key} data-state={todo.completed && 'selected'}>
      <TableCell>
        <fetcher.Form method="post">
          <button type="submit" name="intent" value={INTENT_UPDATE_TASK}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="completed" value={completed ? 'false' : 'true'} />
            <Checkbox className="cursor-pointer" checked={completed} />
          </button>
        </fetcher.Form>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{text}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{new Date(createdAt).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell className="text-right">
        <Form method="post">
          <input type="hidden" name="id" value={todo.id} />
          <Button variant="link" type="submit" name="intent" value={INTENT_DELETE_TASK}>
            Delete
          </Button>
        </Form>
      </TableCell>
    </TableRow>
  );
};

export default TodoList;
