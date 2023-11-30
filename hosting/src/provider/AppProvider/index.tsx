import { ReactNode, createContext, useState, Dispatch, SetStateAction } from 'react';

interface Todo {
    id: string;
    todo: string;
    status: string;
    priority: string;
    due_date: string;
    maker: string;
}

interface User {
    username: string;
    role: string;
}
interface Props {
    children: ReactNode;
}
interface ContextProps {
    todolist: Todo[];
    setTodolist: Dispatch<SetStateAction<Todo[]>>;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>
}

const defaultValue: ContextProps = {
    todolist: [],
    setTodolist: () => {},
    user: null,
    setUser: () => {}
};

export const AppContext = createContext<ContextProps>(defaultValue);

const AppProvider = ({ children }: Props) => {
    const [todolist, setTodolist] = useState<Todo[]>([]);
    const [user, setUser] = useState<User | null>(null);


    return (
        <AppContext.Provider value={{ todolist, setTodolist, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
