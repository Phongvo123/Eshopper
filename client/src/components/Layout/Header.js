import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { HiOutlineShoppingBag } from "react-icons/hi";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate(`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container px-0">
          <div className="navbar-brand">E SHOPPER</div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  TRANG CHỦ
                </NavLink>
              </li>
              <li class="nav-item">
                <NavLink to="/about" className="nav-link">
                  GIỚI THIỆU
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link">
                  LIÊN HỆ
                </NavLink>
              </li>
            </ul>
            <div className="d-flex">
              <div className="input-group me-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="search..."
                />
                <span className="input-group-text">
                  <FaSearch />
                </span>
              </div>
              <div className="header-icons d-flex gap-3">
                <Badge
                  count={order?.orderItems?.length}
                  onClick={() => navigate("/order")}
                  style={{ cursor: "pointer" }}
                >
                  <HiOutlineShoppingBag
                    size="30px"
                    color="#fff"
                    style={{ cursor: "pointer" }}
                  />
                </Badge>

                {!auth.user ? (
                  <span className="avatar_icon" style={{ cursor: "pointer" }}>
                    <NavLink to="/login" className="nav-link">
                      <FaUserCircle size="30px" />
                    </NavLink>
                  </span>
                ) : (
                  <div class="dropdown" style={{ cursor: "pointer" }}>
                    <p
                      class="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {auth.user.name}
                    </p>
                    <ul class="dropdown-menu">
                      <li>
                        <span class="dropdown-item" onClick={handleDashboard}>
                          Hệ thống
                          <Badge
                            style={{ left: "50px", background: "#f1bc31" }}
                            count={order?.notify}
                          ></Badge>
                        </span>
                      </li>
                      <li>
                        <span
                          class="dropdown-item"
                          onClick={() => navigate("/my-order")}
                        >
                          Đơn hàng của tôi
                        </span>
                      </li>
                      <li>
                        <span class="dropdown-item" onClick={handleLogout}>
                          Logout
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
