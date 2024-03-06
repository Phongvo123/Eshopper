import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";
const Register = () => {
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        {
          ...stateUser,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
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
            REGISTER FORM
          </h3>
          <div className="mb-3">
            <input
              type="text"
              class="form-control rounded-left"
              placeholder="Enter Your Name"
              required
              autoFocus
              onChange={handleOnchange}
              name="name"
              value={stateUser.name}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              class="form-control rounded-left"
              placeholder="Enter Your Email"
              required
              onChange={handleOnchange}
              name="email"
              value={stateUser.email}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              class="form-control rounded-left"
              placeholder="Enter Your Password"
              required
              onChange={handleOnchange}
              name="password"
              value={stateUser.password}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              class="form-control rounded-left"
              placeholder="Enter Your Phone"
              required
              onChange={handleOnchange}
              name="phone"
              value={stateUser.phone}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              class="form-control rounded-left"
              placeholder="Enter Your Address"
              required
              onChange={handleOnchange}
              name="address"
              value={stateUser.address}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              class="form-control btn rounded submit px-3"
              style={{ backgroundColor: "#202040", color: "white" }}
            >
              REGISTER
            </button>
          </div>
          <p class="message">
            ALready have account? <NavLink to="/login">LOGIN</NavLink>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
