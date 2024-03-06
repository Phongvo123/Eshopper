import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import AdminMenu from "../../../components/Layout/AdminMenu";
import { WrapperItemOrder } from "./style";
import axios from "axios";
import moment from "moment";
import { convertPrice } from "../../../utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { resetNotifyOrder } from "../../../redux/slices/orderSlice";
import { useDispatch } from "react-redux";
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchAllOrder = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/get-all-order`
      );
      if (data?.success) {
        setOrders(data?.allOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

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
              <span style={{ fontWeight: "bold" }}>
                {convertPrice(item?.price)}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  const handleCancelOrder = async (order) => {
    try {
      const data = { orderItems: order?.orderItems, orderId: order?._id };
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/order/cancel-order/${order?._id}`,
        {
          data,
        }
      );
      if (res?.data?.success) {
        toast.success("Đã hủy đơn hàng");
        dispatch(resetNotifyOrder());
        fetchAllOrder();
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  const handleCompleteOrder = async (order) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/complete-order/${order?._id}`
      );
      if (data?.success) {
        toast.success("Hoàn thành đơn hàng");
        dispatch(resetNotifyOrder());
        fetchAllOrder();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Layout>
      <AdminMenu>
        <h1>Quản lý đơn hàng</h1>
        <div className="row d-flex flex-column justify-content-center align-items-center">
          {orders?.map((order) => {
            return (
              <div
                className="col-11"
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
                        Khách hàng
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {order?.shippingAddress?.fullName}
                      </span>
                    </div>
                    <div className="d-flex flex-column  gap-3">
                      <span style={{ color: "rgb(128, 128, 137)" }}>
                        Ngày đặt hàng
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {moment(order?.createdAt).format("DD/MM/YYYY")}
                      </span>
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
                        >{`${
                          order?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                        }`}</span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "rgb(11, 116, 229)",
                          }}
                        >{`${
                          order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                        }`}</span>
                      </div>
                    </div>
                  </div>
                  {renderProduct(order?.orderItems)}
                  {order?.status === "Chờ hủy" ? (
                    <div className="d-flex gap-3 justify-content-end">
                      <span
                        style={{
                          color: "rgb(10, 104, 255)",
                          paddingTop: "5px",
                        }}
                      >
                        Khách hàng yêu cầu hủy đơn hàng:{" "}
                      </span>
                      <Button
                        size={40}
                        style={{
                          height: "36px",
                          border: "none",
                          borderRadius: "4px",
                          background: "#f1bc31",
                          padding: "4px",
                          color: "black",
                          fontSize: "14px",
                        }}
                        textbutton={"Hủy đơn hàng"}
                        onClick={() => handleCancelOrder(order)}
                      >
                        Hủy đơn hàng
                      </Button>
                      <Button
                        size={40}
                        style={{
                          height: "36px",
                          border: "none",
                          borderRadius: "4px",
                          background: "#f1bc31",
                          padding: "4px",
                          color: "black",
                          fontSize: "14px",
                        }}
                        textbutton={"Xem chi tiết"}
                        onClick={() => navigate(`/details-order/${order?._id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="d-flex gap-3 justify-content-end"
                      style={{ marginTop: "20px" }}
                    >
                      <Button
                        size={40}
                        style={{
                          height: "36px",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px",
                          background: "#f1bc31",
                          color: "black",
                          fontSize: "14px",
                        }}
                        textbutton={"Xem chi tiết"}
                        onClick={() => navigate(`/details-order/${order?._id}`)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        size={40}
                        style={{
                          height: "36px",
                          border: "none",
                          borderRadius: "4px",
                          background: "#f1bc31",
                          padding: "4px",
                          color: "black",
                          fontSize: "14px",
                        }}
                        textbutton={"Xem chi tiết"}
                        disabled={order?.isPaid && order?.isDelivered}
                        onClick={() => handleCompleteOrder(order)}
                      >
                        Hoàn thành đơn hàng
                      </Button>
                    </div>
                  )}
                </WrapperItemOrder>
              </div>
            );
          })}
        </div>
      </AdminMenu>
    </Layout>
  );
};

export default OrderManagement;
