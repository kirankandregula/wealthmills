import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ userName: '', passWord: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace the URL with your Google Apps Script URL
    axios.get('YOUR_GOOGLE_APPS_SCRIPT_URL')
      .then(response => {
        const data = response.data;
        console.log(data);
        const user = data[credentials.userName.toLowerCase()];
        if (user && user.Password === credentials.passWord) {
          // Handle successful login
          console.log('Login successful');
        } else {
          setErrorMessage('Invalid username or password');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setErrorMessage('Failed to login. Please try again.');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card w-50">
        <div className="card-body">
          <h2 className="card-title text-center">User Login</h2>
          {errorMessage && <p className="text-center text-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">Username:</label>
              <input type="text" id="userName" name="userName" value={credentials.userName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="passWord" className="form-label">Password:</label>
              <input type="password" id="passWord" name="passWord" value={credentials.passWord} onChange={handleChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#7700a6" }}>Login</button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
