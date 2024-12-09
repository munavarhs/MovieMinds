import React, { useState, useEffect } from 'react';
import '../styles/ConnectPage.css';
import { useNavigate} from 'react-router-dom';

const ConnectPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchFullName, setSearchFullName] = useState('');


  // Fetch the user's profile after the component mounts
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')
      }`, // Replacing with the actual token storage
  },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch user profile');
          navigate('/login'); // Redirect to login if the profile fetch fails
          throw new Error('Failed to fetch profile');
        }
      })
      .then((data) => {
        setUsername(`${data.firstName} ${data.lastName}`); // Set the user's name
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [navigate]);

  // Fetching matching users after the component mounts.
  useEffect(() => {
    fetch('http://localhost:4000/find-matching-users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setMatchingUsers(data))
      .catch((error) => console.error('Error fetching matching users:', error));
  }, []);

  const handleSearch = async () => {
    const searchPayload = {};
    if (searchEmail) {
        searchPayload.email = searchEmail;
    } else if (searchFullName) {
        searchPayload.fullName = searchFullName;
    }

    try {
        const response = await fetch('http://localhost:4000/find-matching-users', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchPayload),
        });

        if (response.ok) {
            const data = await response.json();
            setMatchingUsers(data);
        } else {
            const errorData = await response.json();
            console.error(errorData.error);
            alert(errorData.error || 'Error fetching users');
        }
    } catch (error) {
        console.error('Error searching users:', error);
    }
};


  const handleLogout = () => {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          console.error('Failed to log out from server');
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  const handleClick = () => {
      navigate('/home-page')
  }
  return (
    <div className="connect-page">
    <header className="header">
      <div className="profile">
        <img
          src="https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
          alt="User"
          className="profile-pic"
        />
        <span className="username-badge">{username || 'Loading...'}</span>
      </div>
      <h1 className="title">MOVIE MiND’s - Connect</h1>
      <div className='btns-container'>
      <button className ="logout-btn" style={{'background':'#93131B', color:'#FFF', padding:'13px'}}onClick={handleClick}>BACK TO BROWSE</button>
      <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </div>
    </header>

    {/* Search Section */}
    <div className="search-section">
      <h2>Need People with similar interest?</h2>
      <div className="search-inputs">
        <input type="text" placeholder="Enter Email Address..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} 
         />
        <span className="or">OR</span>
        <input type="text" placeholder="Enter Fullname..." value={searchFullName}
            onChange={(e) => setSearchFullName(e.target.value)} />
        <button className="connect-btn" onClick={handleSearch}>CONNECT</button>
      </div>
    </div>

    {/* Friends and Pending Requests Section */}
    <div className="content-section">
      {/* <div className="friends-section">
        <h2>People With Matching Preferences, WANT TO CONNECT?</h2>
        <ul>
        {matchingUsers.length > 0 ? (
            matchingUsers.map((user, index) => (
              <li key={user._id}>
                  <span className="friend-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <a
                    href={user.socialLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    {user.socialLinks}
                  </a>
                  <button className="unfriend-btn">CONNECT</button>
                </li>
            ))
          ) : (
            <p>No matching users found.</p>
          )}
        </ul>
      </div> */}
      <div class="friends-section">
  <h2>People With Matching Preferences, WANT TO CONNECT?</h2>
  <ul class="matching-users-list">
    {matchingUsers.length > 0 ? (
      matchingUsers.map((user) => (
        <li class="matching-user" key={user._id}>
          <div class="user-info">
            <img
              src="https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=" 
              alt={`${user.firstName} ${user.lastName}`}
              class="user-avatar"
            />
            <div class="user-details">
              <span class="user-name">{user.firstName} {user.lastName}</span>
              <a
                href={user.socialLinks}
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                Visit Profile
              </a>
            </div>
          </div>
          <button class="connect-btn">
          <a
                href={user.socialLinks}
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                style={{color: 'white', textDecoration: 'none', cursor: 'pointer'}}
              >CONNECT
                </a>
               
              </button>
        </li>
      ))
    ) : (
      <p>No matching users found.</p>
    )}
  </ul>
</div>

      
    </div>
  </div>
);
};

export default ConnectPage;
