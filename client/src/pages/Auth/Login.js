import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/AuthStyles.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        if (location?.state) {
          navigate(location?.state);
        } else {
          navigate("/");
        }
      } else if (!res.data.success) {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <form className="p-4 p-md-5" onSubmit={handleSubmit}>
          <div className="d-flex align-items-center justify-content-center mb-3">
            <span>
              <FaUserCircle size="50px" style={{ color: "#202040" }} />
            </span>
          </div>
          <h3 className="text-center mb-4" style={{ color: "#202040" }}>
            LOGIN FORM
          </h3>
          <div className="mb-3">
            <input
              type="email"
              class="form-control rounded-left"
              placeholder="Enter Your Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              class="form-control rounded-left"
              placeholder="Enter Your Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              class="form-control btn rounded submit px-3"
              style={{ backgroundColor: "#202040", color: "white" }}
            >
              Login
            </button>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              class="form-control btn rounded submit px-3"
              style={{ backgroundColor: "#202040", color: "white" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password
            </button>
          </div>
          <p class="message">
            Not registered? <NavLink to="/register">Create an account</NavLink>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
