import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { TodoRecord } from '@/data';
import { createTodo, deleteTodo, getTodos, updateTodo } from '@/data';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, redirect, useLoaderData, useNavigation } from '@remix-run/react';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

export const meta: MetaFunction = () => [
  { title: 'Todo List | Remix Todo List' },
  {
    name: 'description',
    content: 'Remix Todo List! Todo List Page!'
  }
];

export async function loader() {
  const todos = await getTodos();
  if (!todos) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ todos });
}

const INTENT_ADD_TASK = 'add';
const INTENT_DELETE_TASK = 'delete';
const INTENT_UPDATE_TASK = 'update';

const columns: ColumnDef<TodoRecord>[] = [
  {
    header: 'Text',
    accessorKey: 'text'
  }
];

export async function action({ request }: ActionFunctionArgs) {
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
}

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
        <TableComponent todos={todos} />
      </ul>
    </div>
  );
};

const TableComponent = ({ todos }: { todos: TodoRecord[] }) => {
  const table = useReactTable({
    columns,
    data: todos,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default TodoList;
