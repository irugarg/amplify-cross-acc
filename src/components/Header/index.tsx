import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Content, Profile } from './style';
import logo from '../../assets/img/logo_aws.svg';
import { useAuth } from '../../hooks/AuthContext';
import profilePhoto from '../../assets/img/profile.jpg';

const HeaderComponent: React.FC = () => {
  const { user } = useAuth();
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="AWS" />
          <Link to="/dashboard">DASHBOARD</Link>
        </nav>

        <aside>
          {!!user.email && (
            <Profile>
              <div>
                <strong>{user.name || user.email}</strong>
                <Link id="profile" to="/profile">
                  My Profile
                </Link>
              </div>
              <img src={user.profileURL || profilePhoto} alt="Profile" />
            </Profile>
          )}
        </aside>
      </Content>
    </Container>
  );
};

export default HeaderComponent;
