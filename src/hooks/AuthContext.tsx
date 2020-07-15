import React, { createContext, useCallback, useState, useContext } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { GetUserQuery } from '../API';
import { getUser } from '../graphql/queries';
import { createUser } from '../graphql/mutations';

interface IUserContext {
  user: IUser;
  signIn(): Promise<void>;
  setUserState: React.Dispatch<React.SetStateAction<IUser>>;
}

export interface IUser {
  id: string;
  name?: string;
  email: string;
  profilePhoto?: { bucket: string; region: string; key: string };
  profileURL?: string;
}

export const AuthContext = createContext<IUserContext>({} as IUserContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [userState, setUserState] = useState<IUser>(() => {
    const user = localStorage.getItem('@AuthUser');

    if (user) {
      return JSON.parse(user);
    }

    return {} as IUser;
  });

  const signIn = useCallback(async () => {
    const { attributes } = await Auth.currentUserInfo();
    // Return the user from DynamoDB
    const res = (await API.graphql(
      graphqlOperation(getUser, {
        id: attributes.sub,
      }),
    )) as {
      data: GetUserQuery;
    };

    let userProfile: IUser = {
      id: attributes.sub,
      email: attributes.email,
    };

    if (res.data.getUser) {
      userProfile = {
        ...userProfile,
        name: res.data.getUser.name,
        profilePhoto: res.data.getUser.profilePhoto,
      } as IUser;

      if (res.data.getUser.profilePhoto) {
        const profileURL = await Storage.get(res.data.getUser.profilePhoto.key);

        userProfile = {
          ...userProfile,
          profileURL: profileURL.toString(),
        };
      }
    } else {
      try {
        await API.graphql(
          graphqlOperation(createUser, {
            input: userProfile,
          }),
        );
      } catch (e) {
        console.error(e);
      }
    }

    localStorage.setItem('@AuthUser', JSON.stringify(userProfile));
    setUserState(userProfile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: userState,
        signIn,
        setUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IUserContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
