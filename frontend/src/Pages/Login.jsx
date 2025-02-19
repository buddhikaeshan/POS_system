import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Login() {
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    const postData = {
      userName: formData.userName,
      userPassword: formData.password,
    };

    try {
      const response = await fetch(`${config.BASE_URL}/userLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok || data.message_type === "error") {
        setMessage(data.message || "An error occurred during login.");
        setAlertType("alert alert-danger");
        setShowAlert(true);
        return;
      }

      const { userName, userEmail, userStatus, userType } = data.user;
      const token = data.token;

      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userStatus", userStatus);
      localStorage.setItem("userType", userType);
      localStorage.setItem("token", token);

      if (userType === "User") {
        navigate("/sales/invoice");
      } else {
        navigate("/");
      }

    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 rounded shadow-lg w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1>Pos System</h1>
        </div>
        <h2 className="text-center mb-4">Welcome!</h2>

        {showAlert && (
          <div className="row mt-2">
            <div className="col-md-12">
              <div className={alertType}>
                {message}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Username</label>
            <input
              type="text"
              name="userName"
              id="userName"
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              value={formData.userName}
              required
            />
            {errors.userName && <small className="text-danger">{errors.userName}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          {error && <div className="text-danger text-center mb-3">{error}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={processing}>
            {processing ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="#">Contact Admin</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
