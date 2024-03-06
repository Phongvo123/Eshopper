import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  WrapperItemLabel,
  WrapperItem,
  WrapperCard,
  WrapperLabel,
  WrapperInfoUser,
} from "./style";
import { useParams } from "react-router-dom";
import axios from "axios";
import { convertPrice } from "../../utils";
import { orderContant } from "../../contant";

const DetailsOrderPage = () => {
  const params = useParams();
  const { id } = params;
  const [detailsOrder, setDetailsOrder] = useState({});

  const fetchDetailsOrder = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/get-details-order/${id}`
      );
      if (data?.success) {
        setDetailsOrder(data?.order);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetailsOrder();
  }, [id]);

  return (
    <Layout>
      <div style={{ width: "100%", height: "100vh", background: "#f5f5fa" }}>
        <div className="container">
          <div className="d-flex justify-content-between">
            <div className="d-flex ">
              <h4>Chi tiết đơn hàng #{detailsOrder?._id}</h4>
              <span>ESHOPPER đã tiếp nhận đơn hàng</span>
            </div>
            <div>
              <span>Ngày đặt hàng</span>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <WrapperCard>
                <div className="d-flex align-items-center justify-content-between">
                  <div style={{ width: "670px", color: "rgb(120, 120, 120)" }}>
                    Sản phẩm
                  </div>
                  <WrapperItemLabel>Giá</WrapperItemLabel>
                  <WrapperItemLabel>Số lượng</WrapperItemLabel>
                  <div style={{ width: "100px", color: "rgb(120, 120, 120)" }}>
                    Tạm tính
                  </div>
                </div>
                {detailsOrder?.orderItems?.map((order) => {
                  return (
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{
                        borderBottom: "1px solid #ccc ",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        style={{ width: "670px", marginBottom: "10px" }}
                        className="d-flex align-items-center gap-3"
                      >
                        <img
                          src={order?.image}
                          alt="logo"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid rgb(238, 238, 238)",
                            padding: "2px",
                          }}
                        />
                        <div>{order?.name}</div>
                      </div>
                      <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                      <WrapperItem>{order?.amount}</WrapperItem>
                      <div style={{ right: "0" }}>
                        {convertPrice(order?.price * order?.amount)}
                      </div>
                    </div>
                  );
                })}

                <div
                  className="d-flex flex-column align-items-end"
                  style={{ marginTop: "20px" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ width: "250px" }}
                  >
                    <div style={{ color: "rgb(120, 120, 120)" }}>
                      Tổng tạm tính
                    </div>
                    <div>{convertPrice(detailsOrder?.itemsPrice)}</div>
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ width: "250px" }}
                  >
                    <div style={{ color: "rgb(120, 120, 120)" }}>
                      {convertPrice(detailsOrder?.shippingPrice)}
                    </div>
                    <div>0đ</div>
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ width: "250px" }}
                  >
                    <div style={{ color: "rgb(120, 120, 120)" }}>Tổng tiền</div>
                    <div style={{ color: "rgb(254, 56, 52)" }}>
                      {convertPrice(detailsOrder?.totalPrice)}
                    </div>
                  </div>
                </div>
              </WrapperCard>
            </div>
            <div className="col-3">
              <WrapperCard style={{ marginBottom: "12px" }}>
                <WrapperLabel>ĐỊA CHỈ NGƯỜI NHẬN</WrapperLabel>
                <WrapperInfoUser>
                  <div className="name-info">
                    {detailsOrder?.shippingAddress?.fullName}
                  </div>
                  <div className="address-info">
                    <span>Địa chỉ: </span>
                    {`${detailsOrder?.shippingAddress?.address} ${detailsOrder?.shippingAddress?.city}`}
                  </div>
                  <div className="phone-info">
                    <span>Số điện thoại: </span>
                    {detailsOrder?.shippingAddress?.phone}
                  </div>
                </WrapperInfoUser>
              </WrapperCard>
              <WrapperCard>
                <WrapperLabel>HÌNH THỨC THANH TOÁN</WrapperLabel>
                <WrapperInfoUser>
                  <div className="delivery-info">
                    {orderContant.payment[detailsOrder?.paymentMethod]}
                  </div>
                  <div className="delivery-fee">
                    {detailsOrder?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </div>
                </WrapperInfoUser>
              </WrapperCard>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsOrderPage;
