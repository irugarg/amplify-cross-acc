import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import Profile from '../../pages/Profile';
import * as UserModel from '../../models/User';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Should have prefix mock
const mockAddToast = jest.fn();
jest.mock('../../hooks/ToastContext', () => {
  return {
    useToast: () => ({
      addToast: mockAddToast,
    }),
  };
});

// Should have prefix mock
const mocksetUserState = jest.fn();
jest.mock('../../hooks/AuthContext', () => {
  return {
    useAuth: () => ({
      setUserState: mocksetUserState,
    }),
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockAddToast.mockReset();
  });

  it('should display an error if password != confirmpassword', () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);
    const oldpwdField = getByPlaceholderText('Old Password');
    const newpwdField = getByPlaceholderText('New Password');
    const cnmpwdField = getByPlaceholderText('Confirm Password');
    const btnSubmitField = getByText('Update Profile');

    fireEvent.change(oldpwdField, { target: { value: 'oldpassword' } });
    fireEvent.change(newpwdField, { target: { value: '1234567' } });
    fireEvent.change(cnmpwdField, { target: { value: '123456' } });

    fireEvent.click(btnSubmitField);

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
      }),
    );
  });

  it('should just update the name', async () => {
    const mockUpdateProfile = jest.spyOn(UserModel, 'updateProfile');

    mockUpdateProfile.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve;
      });
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);
    const nameField = getByPlaceholderText('Full Name');
    const newpwdField = getByPlaceholderText('New Password');
    const cnmpwdField = getByPlaceholderText('Confirm Password');
    const btnSubmitField = getByText('Update Profile');

    fireEvent.change(newpwdField, { target: { value: '' } });
    fireEvent.change(cnmpwdField, { target: { value: '' } });
    fireEvent.change(nameField, { target: { value: 'jhon.doe@aws.com' } });
    fireEvent.click(btnSubmitField);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'jhon.doe@aws.com',
        }),
      );
    });
  });

  it('should change password', async () => {
    const mockUpdateProfile = jest.spyOn(UserModel, 'updateProfile');
    const mockChangeUserPassword = jest.spyOn(UserModel, 'changeUserPassword');

    mockUpdateProfile.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve;
      });
    });

    mockChangeUserPassword.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve;
      });
    });

    // Mock Cognito Auth
    const mockcurrentAuthenticatedUser = jest.spyOn(
      Auth,
      'currentAuthenticatedUser',
    );

    mockcurrentAuthenticatedUser.mockImplementation(() => {
      return Promise.resolve('user');
    });
    jest.spyOn(Auth, 'changePassword').mockImplementation((data) => {
      return Promise.resolve(data);
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);
    const oldpwdField = getByPlaceholderText('Old Password');
    const newpwdField = getByPlaceholderText('New Password');
    const cnmpwdField = getByPlaceholderText('Confirm Password');
    const btnSubmitField = getByText('Update Profile');

    fireEvent.change(oldpwdField, { target: { value: 'oldpassword' } });
    fireEvent.change(newpwdField, { target: { value: '1234567' } });
    fireEvent.change(cnmpwdField, { target: { value: '1234567' } });

    fireEvent.click(btnSubmitField);

    await waitFor(() => {
      expect(mockUpdateProfile).toBeCalled();
      expect(mockChangeUserPassword).toBeCalled();
    });
  });
});
