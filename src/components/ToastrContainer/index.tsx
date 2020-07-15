import React from 'react';
import { useTransition } from 'react-spring';
import { ItoastMessage } from '../../hooks/ToastContext';
import { Container } from './styles';
import Toast from './Toast';

interface IToastContainer {
  messages: ItoastMessage[];
}

const ToastContainer: React.FC<IToastContainer> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    (message) => message.id,
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' },
    },
  );
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
