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
    const keys = Object.keys(fakeTodos.records);

    const a = keys.reduce<TodoRecord[]>((acc, todoKey) => {
      const s = fakeTodos.records[todoKey];
      if (s) acc.push(s);
      return acc;
    }, []);
    return a;
  },

  async get(id: string): Promise<TodoRecord | null> {
    return fakeTodos.records[id] || null;
  },

  async create(values: TodoMutation): Promise<TodoRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
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
  const text = formData.get('text');
  if (typeof text !== 'string') {
    throw new Response('Invalid text', { status: 400 });
  }

  const todo = await fakeTodos.create({ text });
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
    throw new Response('Invalid text', { status: 400 });
  }
  if (typeof completed !== 'string') {
    throw new Response('Invalid text', { status: 400 });
  }

  const todo = await fakeTodos.set(id, {
    completed: completed === 'true'
  });
  return todo;
};
