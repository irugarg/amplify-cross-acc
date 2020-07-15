import React, { useCallback, ChangeEvent } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FiCamera } from 'react-icons/fi';
import { Container, ProfilePhoto } from './styles';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import { updateUser } from '../../graphql/mutations';
import { IUser, useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import profilePhoto from '../../assets/img/profile.jpg';
import awsExports from '../../aws-exports.js';
import { updateProfile, changeUserPassword } from '../../models/User';

const Profile: React.FC = () => {
  const { user, setUserState } = useAuth();
  const { addToast } = useToast();

  const handleProfilePhotoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        Storage.put(file.name, file, {
          contentType: 'image/png',
        }).then(async () => {
          await API.graphql(
            graphqlOperation(updateUser, {
              input: {
                id: user.id,
                profilePhoto: {
                  bucket: awsExports.aws_user_files_s3_bucket,
                  region: awsExports.aws_user_files_s3_bucket_region,
                  key: file.name,
                },
              },
            }),
          );
          const profileURL = await Storage.get(file.name);
          const profileData = { ...user, profileURL: profileURL.toString() };
          setUserState(profileData);
          localStorage.setItem('@AuthUser', JSON.stringify(profileData));

          addToast({
            title: 'Success!',
            description: 'Profile photo updated.',
            type: 'success',
          });
        });
      }
    },
    [addToast, setUserState, user],
  );

  const updateUserDynamo = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      oldPassword: string;
      confirmPassword: string;
    }) => {
      const userProfile: IUser = {
        ...user,
        name: data.name,
      };
      setUserState(userProfile);
      localStorage.setItem('@AuthUser', JSON.stringify(userProfile));

      // Removing userProfile.profileURL for dynamo and immutability state
      const { profileURL, ...rest } = userProfile;
      await updateProfile(rest);
    },
    [setUserState, user],
  );

  const handleUpdateProfile = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      oldPassword: string;
      confirmPassword: string;
    }) => {
      if (data.password !== data.confirmPassword) {
        addToast({
          title: 'Error',
          description: 'Password does not match.',
          type: 'error',
        });
        return;
      }

      if (!data.password && !data.confirmPassword && !data.oldPassword) {
        await updateUserDynamo(data);
        addToast({
          title: 'Success',
          description: 'Name changed with Success.',
          type: 'success',
        });
      } else {
        try {
          await changeUserPassword(data);
          await updateUserDynamo(data);
          addToast({
            title: 'Success',
            description: 'Password changed with Success.',
            type: 'success',
          });
        } catch (e) {
          addToast({
            title: 'Error',
            description: 'Incorrect username or password.',
            type: 'error',
          });
        }
      }
    },
    [addToast, updateUserDynamo],
  );

  function handleLogout() {
    Auth.signOut().then(() => {
      localStorage.removeItem('@AuthUser');
      setUserState({} as IUser);
    });
  }

  return (
    <Container>
      <Form onSubmit={handleUpdateProfile}>
        <ProfilePhoto>
          <img src={user?.profileURL || profilePhoto} alt={user?.name} />
          <label htmlFor="profilePhoto">
            <FiCamera />
            <input
              type="file"
              id="profilePhoto"
              onChange={handleProfilePhotoChange}
            />
          </label>
        </ProfilePhoto>

        <h1>My profile</h1>
        <Input
          readOnly
          name="email"
          defaultValue={user?.email}
          type="email"
          placeholder="Email"
        />
        <Input name="name" defaultValue={user?.name} placeholder="Full Name" />
        <hr />
        <Input type="password" name="oldPassword" placeholder="Old Password" />
        <Input type="password" name="password" placeholder="New Password" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
        />
        <Button type="submit">Update Profile</Button>
      </Form>
      <Link id="logoutBtn" to="/" onClick={handleLogout}>
        Logout
      </Link>
    </Container>
  );
};

export default Profile;
