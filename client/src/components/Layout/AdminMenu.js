import { Badge } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminMenu = ({ children }) => {
  const order = useSelector((state) => state.order);
  return (
    <>
      <div className="container px-0">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <label
                className="list-group-item d-flex align-items-center"
                style={{
                  height: "65px",
                  backgroundColor: "#202040",
                  color: "#f1bc31",
                }}
              >
                <h6 style={{ fontSize: "20px" }}>Admin Panel</h6>
              </label>
              <NavLink
                to="/dashboard/admin/create-category"
                className="list-group-item"
              >
                Create Category
              </NavLink>
              <NavLink
                to="/dashboard/admin/create-product"
                className="list-group-item"
              >
                Create Product
              </NavLink>
              <NavLink to="/dashboard/admin/order" className="list-group-item">
                Order
                <Badge
                  count={order?.notify}
                  style={{ left: "200px", background: "#f1bc31" }}
                ></Badge>
              </NavLink>
              <NavLink to="/dashboard/admin/users" className="list-group-item">
                Users
              </NavLink>
            </div>
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
