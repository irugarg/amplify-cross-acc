import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { Container } from './styles';
import { ItoastMessage, useToast } from '../../../hooks/ToastContext';

interface ToastProps {
  message: ItoastMessage;
  style: object;
}
const icons = {
  info: <FiInfo size={24} />,
  success: <FiAlertCircle size={24} />,
  error: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  function removeToastHandler(id: string) {
    removeToast(id);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    // ComponentDidUpdate
    return () => {
      clearTimeout(timer);
    };
    // Toda vez que o removeToast é executado renderiza o UseEffect
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      hasDescription={!!message.description}
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToastHandler(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
