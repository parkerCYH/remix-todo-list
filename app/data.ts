type TodoMutation = {
  id?: string;
  text?: string;
  completed?: boolean;
};

export type TodoRecord = TodoMutation & {
  id: string;
  createdAt: string;
};

const fakeTodos = {
  records: {} as Record<string, TodoRecord>,
  async getAll(): Promise<TodoRecord[]> {
    return Object.keys(fakeTodos.records).reduce<TodoRecord[]>((acc, todoKey) => {
      const s = fakeTodos.records[todoKey];
      if (s) acc.push(s);
      return acc;
    }, []);
  },

  async get(id: string): Promise<TodoRecord | null> {
    return fakeTodos.records[id] || null;
  },

  async create(values: TodoMutation): Promise<TodoRecord> {
    const id = values.id || crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newContact = { ...values, id, createdAt };
    fakeTodos.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: TodoMutation): Promise<TodoRecord | null> {
    const todo = await fakeTodos.get(id);
    if (!todo) return null;
    const updatedContact = { ...todo, ...values };
    fakeTodos.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeTodos.records[id];
    return null;
  }
};

export const createTodo = async (formData: FormData) => {
  const id = formData.get('id');
  const text = formData.get('text');
  const completed = formData.get('completed');

  if (typeof text !== 'string') {
    throw new Response('Invalid text', { status: 400 });
  }

  const todo = await fakeTodos.create({
    id: id ? String(id) : undefined,
    text,
    completed: completed === 'true'
  });
  return todo;
};

export const deleteTodo = async (formData: FormData) => {
  const id = formData.get('id');
  if (typeof id !== 'string') {
    throw new Response('Invalid text', { status: 400 });
  }

  fakeTodos.destroy(id);
};

export const getTodos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let todos = await fakeTodos.getAll();

  return todos;
};

export const updateTodo = async (formData: FormData) => {
  const id = formData.get('id');
  const completed = formData.get('completed');
  if (typeof id !== 'string') {
    throw new Response('Invalid id', { status: 400 });
  }
  if (typeof completed !== 'string') {
    throw new Response('Invalid completed', { status: 400 });
  }

  const todo = await fakeTodos.set(id, {
    completed: completed === 'true'
  });
  return todo;
};

const MockData: Required<TodoRecord>[] = [
  { id: '1', text: 'Feed the cat 🐱', createdAt: new Date().toISOString(), completed: true },
  { id: '2', text: 'Water the plants 🌱', createdAt: new Date().toISOString(), completed: false },
  { id: '3', text: 'Read a book 📚', createdAt: new Date().toISOString(), completed: true },
  { id: '4', text: 'Go for a walk 🚶‍♂️', createdAt: new Date().toISOString(), completed: false },
  { id: '5', text: 'Bake cookies 🍪', createdAt: new Date().toISOString(), completed: true }
];

MockData.forEach((todo) => {
  const formData = new FormData();
  formData.append('id', todo.id);
  formData.append('text', todo.text);
  formData.append('createdAt', todo.createdAt);
  formData.append('completed', todo.completed ? 'true' : 'false');

  createTodo(formData);
});
