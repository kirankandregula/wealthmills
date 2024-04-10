import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie
import { ClipLoader } from 'react-spinners';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ userName: '', passWord: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['userName', 'userRole']); // Use useCookies hook
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.userName && cookies.userRole) {
      navigate('/portfolio');
    }
  }, [cookies, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace the URL with your Google Apps Script URL
    axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=PJ-_sBon-6ROFNmsTxt5H22x2jwBBcVYOwgPRfBpQS1nLCnivvluJ1w0-8SUrVdSXXCynU4kODXcDlocawcR4zJomXV63oIJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMqy3F1P4Fdc_ZYC95gds4g8EZem4AUjoNh107WXpquBj1_1MJz1Zmhu1Y6sn3Rd1VhValBzX8Y_4ESG5SstToNd_L4CvoM-Uw&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb')
      .then(response => {
        const data = response.data;
        const user = data.find(u => u.Name.toLowerCase() === credentials.userName.toLowerCase() && u.Password === credentials.passWord);
        if (user) {
          // Handle successful login
          console.log('Login successful');
          setCookie('userName', user.Name, { path: '/' }); // Set cookie for userName
          setCookie('userRole', user.Role, { path: '/' }); // Set cookie for userRole
          navigate('/portfolio');
        } else {
          setErrorMessage('Invalid username or password');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setErrorMessage('Failed to login. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "80px" }}>
      <div className="card w-70">
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
            <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#7700a6" }}>
              {loading ? <ClipLoader color={"#ffffff"} size={20} /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
