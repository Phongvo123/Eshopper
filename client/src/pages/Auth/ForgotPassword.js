import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { RiErrorWarningLine } from "react-icons/ri";
import "../../styles/AuthStyles.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        {
          email,
          newPassword,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <form className="p-4 p-md-5" onSubmit={handleSubmit}>
          <div className="d-flex align-items-center justify-content-center mb-3">
            <span>
              <RiErrorWarningLine size="50px" style={{ color: "#202040" }} />
            </span>
          </div>
          <h3 className="text-center mb-4" style={{ color: "#202040" }}>
            RESET PASSWORD
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
              placeholder="Enter Your New Password"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              class="form-control btn rounded submit px-3"
              style={{ backgroundColor: "#202040", color: "white" }}
            >
              RESET
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
