import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Button from '../../components/Button';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaulValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Button component', () => {
  it('Should be able to render Button', () => {
    // eslint-disable-next-line no-shadow
    const { getByText } = render(<Button type="button">Click Here</Button>);

    expect(getByText('Click Here')).toBeTruthy();
  });
});
