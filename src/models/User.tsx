// eslint-disable-next-line import/no-extraneous-dependencies
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify';
import { IUser } from '../hooks/AuthContext';
import { updateUser } from '../graphql/mutations';
import { listPostsSortedByTimestamp, getUser } from '../graphql/queries';
import { ListPostsSortedByTimestampQuery, GetUserQuery } from '../API';

const EMPTY_USER = { items: [], nextToken: '' };

export interface chimeUserData {
  email: string;
  name: string | null;
  profileURL: string;
}

export const updateProfile = async (data: IUser) => {
  try {
    const user = await API.graphql(
      graphqlOperation(updateUser, { input: data }),
    );

    if (user) {
      return user;
    }
    return EMPTY_USER;
  } catch (err) {
    return EMPTY_USER;
  }
};

export const changeUserPassword = async (data: {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  confirmPassword: string;
}) => {
  try {
    const userCognito = await Auth.currentAuthenticatedUser();
    const response = await Auth.changePassword(
      userCognito,
      data.oldPassword,
      data.confirmPassword,
    );
    if (response) {
      return response;
    }

    return EMPTY_USER;
  } catch (err) {
    return EMPTY_USER;
  }
};

export const getDataChimeFromUser = async (
  ownerID: string,
): Promise<chimeUserData> => {
  const res = (await API.graphql(
    graphqlOperation(getUser, {
      id: ownerID,
    }),
  )) as {
    data: GetUserQuery;
  };

  if (res?.data?.getUser) {
    if (res?.data?.getUser?.profilePhoto) {
      const profileURL = await Storage.get(res.data.getUser.profilePhoto.key);
      return {
        email: res.data.getUser.email,
        name: res.data.getUser.name,
        profileURL: profileURL.toString(),
      };
    }

    return {
      email: res.data.getUser.email,
      name: res.data.getUser.name,
      profileURL: '',
    };
  }

  return {
    email: '',
    name: '',
    profileURL: '',
  };
};
