import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  Lable,
  WrapperRadio,
  WrapperInfo,
  WrapperInfoAddress,
  WrapperTotal,
} from "./style";
import { Radio } from "antd";
import { useAuth } from "../../context/auth";
import { convertPrice } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import ModalComponent from "../../components/ModalComponent";
import {
  notifyOrder,
  removeAllOrderProduct,
} from "../../redux/slices/orderSlice";
import { PayPalButton } from "react-paypal-button-v2";
const PaymentPage = () => {
  const [auth, setAuth] = useAuth();
  const order = useSelector((state) => state.order);
  const [payment, setPayment] = useState("later_money");
  const [isOpenModalOrderSuccess, setIsModalOrderSuccess] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo <= 500000) {
      return 10000;
    } else if (priceMemo > 500000 || order?.orderItemsSlected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(deliveryPriceMemo);
  }, [priceMemo, deliveryPriceMemo]);

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const handleAddOrder = async () => {
    try {
      if (!priceMemo) {
        toast.error("Vui lòng thêm sản phẩm cần mua");
      } else {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/order/create-order/`,
          {
            orderItems: order?.orderItemsSlected,
            fullName: auth?.user?.name,
            address: auth?.user?.address,
            phone: auth?.user?.phone,
            city: auth?.user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: auth?.user?._id,
            email: auth?.user?.email,
          }
        );
        if (data?.success) {
          const arrayOrdered = [];
          order?.orderItemsSlected?.forEach((item) => {
            arrayOrdered.push(item.product);
          });
          dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
          dispatch(notifyOrder());
          setIsModalOrderSuccess(true);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  const handleCancleModalOrderSuccess = () => {
    setIsModalOrderSuccess(false);
  };

  const updateOrderAfterPayment = async (details) => {
    try {
      if (!priceMemo) {
        toast.error("Vui lòng thêm sản phẩm cần mua");
      } else {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/order/create-order/`,
          {
            orderItems: order?.orderItemsSlected,
            fullName: auth?.user?.name,
            address: auth?.user?.address,
            phone: auth?.user?.phone,
            city: auth?.user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: auth?.user?._id,
            isPaid: true,
            paidAt: details.update_time,
            email: auth?.user?.email,
          }
        );
        if (data?.success) {
          const arrayOrdered = [];
          order?.orderItemsSlected?.forEach((item) => {
            arrayOrdered.push(item.product);
          });
          dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
          setIsModalOrderSuccess(true);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  const onSuccessPaypal = (details, data) => {
    updateOrderAfterPayment(details);
  };

  const addPaypalScript = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/payment/config`
    );
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data.data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  return (
    <Layout>
      <div style={{ width: "100%", height: "100vh", background: "#f5f5fa" }}>
        <div className="container">
          <h3>Thanh toán</h3>
          <div className="row">
            <div className="col-9">
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio>
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        FAST
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GO_JEK
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio value={payment} onChange={handlePayment}>
                    <Radio value="later_money">
                      Thanh toán tiền mặt khi nhận hàng
                    </Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </div>
            <div className="col-3">
              <div
                style={{
                  background: "rgb(255, 255, 255)",
                  marginBottom: "16px",
                }}
              >
                <WrapperInfoAddress>
                  <div className="d-flex align-items-center justify-content-between">
                    <span
                      style={{
                        color: "rgb(128, 128, 137)",
                        fontWeight: "normal",
                      }}
                    >
                      Giao tới
                    </span>
                    <span
                      style={{ color: "rgb(11, 116, 229)", cursor: "pointer" }}
                      //   onClick={handleChangeAddress}
                    >
                      Thay đổi
                    </span>
                  </div>
                  <div className="d-flex">
                    <p style={{ fontWeight: "bold", margin: "0" }}>
                      {auth?.user?.name}
                    </p>
                    <i
                      style={{
                        display: "block",
                        width: "1px",
                        height: "20px",
                        backgroundColor: "rgb(235, 235, 240)",
                        margin: "0 8px",
                      }}
                    ></i>
                    <p style={{ fontWeight: "bold", margin: "0" }}>
                      {auth?.user?.phone}
                    </p>
                  </div>
                  <div style={{ color: "rgb(128, 128, 137)" }}>
                    <span
                      style={{
                        color: "rgb(0, 171, 86)",
                        backgroundColor: "rgb(239, 255, 244)",
                      }}
                    >
                      Nhà
                    </span>
                    {`${auth?.user?.address}, ${auth?.user?.city}`}
                  </div>
                </WrapperInfoAddress>
              </div>

              <div
                style={{
                  padding: "9px 16px",
                  background: "rgb(255, 255, 255)",
                  marginBottom: "16px",
                }}
              >
                <WrapperInfo>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between ">
                    <span>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      0
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(deliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span className="d-flex flex-column">
                    <span
                      className="float-end"
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    >
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === "paypal" && sdkReady ? (
                <PayPalButton
                  amount={Math.round(totalPriceMemo / 24645)}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    toast.error("Vui lòng thêm sản phẩm cần mua");
                  }}
                />
              ) : (
                <button
                  size={40}
                  style={{
                    background: "rgb(255, 57, 69)",
                    height: "48px",
                    width: "309px",
                    border: "none",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                  textbutton={"Đặt hàng"}
                  onClick={() => handleAddOrder()}
                >
                  Đặt hàng
                </button>
              )}
            </div>
          </div>
        </div>
        <ModalComponent
          title=""
          open={isOpenModalOrderSuccess}
          footer={null}
          onCancel={handleCancleModalOrderSuccess}
        >
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div class="mb-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-success"
                width="75"
                height="75"
                fill="rgb(10, 104, 255)"
                className="bi bi-check-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </div>
            <div className="text-center">
              <h3>Cảm ơn bạn đã mua hàng tại ESHOPPER!</h3>
              <p>
                Thông tin xác nhận về đơn hàng đã được gửi đến địa chỉ mail
                <p style={{ color: "rgb(10, 104, 255)" }}>
                  {auth?.user?.email}
                </p>
              </p>
            </div>
            <div className="d-flex gap-3">
              <button class="btn btn-outline-primary">Xem đơn hàng</button>
              <button class="btn btn-primary">Tiếp tục mua sắm</button>
            </div>
          </div>
        </ModalComponent>
      </div>
    </Layout>
  );
};

export default PaymentPage;
