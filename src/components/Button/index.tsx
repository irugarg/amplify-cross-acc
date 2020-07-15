import React, { ButtonHTMLAttributes } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? <FaSpinner color="#FFF" size={14} /> : children}
  </Container>
);

export default Button;
