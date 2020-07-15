import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastrContainer';

// métodos que irá ter
interface Itoast {
  addToast(data: Omit<ItoastMessage, 'id'>): void;
  removeToast(id: string): void;
}

export interface ItoastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = createContext<Itoast>({} as Itoast);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ItoastMessage[]>([]);

  const addToast = useCallback(
    ({ title, type, description }: Omit<ItoastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages((state) => [...state, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): Itoast {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
