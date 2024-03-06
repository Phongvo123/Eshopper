import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { WrapperItemOrder } from "./style";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { convertPrice } from "../../utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "antd";
const MyOrder = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/get-order-by-userid/${auth?.user?._id}`
      );
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, [auth?.user?._id]);

  const handleCanceOrder = async (order) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/user-cancel-order/${order?._id}`
      );
      if (data?.success) {
        toast.success("Đã gửi yêu cầu hủy đơn hàng");
        fetchMyOrder();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const renderProduct = (data) => {
    return data?.map((item) => {
      return (
        <div
          className="d-flex gap-5 align-items-center"
          style={{
            border: "1px solid rgb(238, 238, 238)",
            marginBottom: "10px",
          }}
        >
          <img
            src={item?.image}
            alt="logo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div style={{ fontSize: "14px" }}>
            <span>{item?.name}</span>
            <div>
              <span>Số lượng: </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {item?.amount}
              </span>
            </div>
            <div>
              <span>Đơn giá: </span>
              <span style={{ fontWeight: "bold" }}>{item?.price}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div style={{ width: "100%", height: "100vh", background: "#f5f5fa" }}>
        <div className="container">
          <h4>Đơn hàng của tôi</h4>
          {!orders.length ? (
            <div className="row d-flex flex-column justify-content-center align-items-center">
              <div className="col-8">
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    padding: "35px",
                    backgroundColor: "rgb(255, 255, 255)",
                  }}
                >
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                    alt="logo"
                  />
                  <p>Chưa có đơn hàng</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="row d-flex flex-column justify-content-center align-items-center">
              {orders?.map((order) => {
                return (
                  <div
                    className="col-8"
                    style={{
                      marginBottom: "20px",
                      boxShadow: "0 12px 12px #ccc",
                    }}
                  >
                    <WrapperItemOrder>
                      <div
                        className="d-flex gap-5"
                        style={{ marginBottom: "30px" }}
                      >
                        <div className="d-flex flex-column gap-3">
                          <span style={{ color: "rgb(128, 128, 137)" }}>
                            Mã đơn hàng
                          </span>
                          <span
                            style={{
                              color: "rgb(11, 116, 229)",
                              fontSize: "14px",
                            }}
                          >
                            {order?._id}
                          </span>
                        </div>
                        <div className="d-flex flex-column  gap-3">
                          <span style={{ color: "rgb(128, 128, 137)" }}>
                            Ngày mua
                          </span>
                          <span style={{ fontSize: "14px" }}>15/05/2004</span>
                        </div>
                        <div className="d-flex flex-column  gap-3">
                          <span style={{ color: "rgb(128, 128, 137)" }}>
                            Tổng tiền
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            {convertPrice(order?.totalPrice)}
                          </span>
                        </div>
                        <div className="d-flex flex-column  gap-3">
                          <span style={{ color: "rgb(128, 128, 137)" }}>
                            Trạng thái
                          </span>
                          <div className="d-flex flex-column">
                            <span
                              style={{
                                fontSize: "14px",
                                color: "rgb(11, 116, 229)",
                              }}
                            >
                              Chưa giao hàng
                            </span>
                            <span
                              style={{
                                fontSize: "14px",
                                color: "rgb(11, 116, 229)",
                              }}
                            >
                              {`${
                                order?.isPaid
                                  ? "Đã thanh toán"
                                  : "Chưa thanh toán"
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                      {renderProduct(order?.orderItems)}
                      <div
                        className="d-flex gap-3 justify-content-end"
                        style={{ marginTop: "20px" }}
                      >
                        <Button
                          size={40}
                          style={{
                            height: "36px",
                            border: "none",
                            background: "#f1bc31",
                            borderRadius: "4px",
                            padding: "4px",
                            color: "black",
                            fontSize: "14px",
                          }}
                          textbutton={"Xem chi tiết"}
                          onClick={() =>
                            navigate(`/details-order/${order?._id}`)
                          }
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          size={40}
                          style={{
                            height: "36px",
                            border: "none",
                            background: "#f1bc31",
                            borderRadius: "4px",
                            padding: "4px",
                            color: "black",
                            fontSize: "14px",
                          }}
                          textbutton={"Hủy đơn hàng"}
                          disabled={
                            order?.status === "Chờ hủy" ||
                            order?.isPaid === true
                          }
                          onClick={() => handleCanceOrder(order)}
                        >
                          Hủy đơn hàng
                        </Button>
                      </div>
                    </WrapperItemOrder>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrder;
