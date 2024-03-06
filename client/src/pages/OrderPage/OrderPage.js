import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout/Layout";
import {
  WrapperStyleHeader,
  CustomCheckbox,
  WrapperListOrder,
  WrapperItemOrder,
  WrapperCountOrder,
  WrapperInfo,
  WrapperTotal,
  WrapperInputNumber,
  WrapperInfoAddress,
  WrapperStyleHeaderDilivery,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { convertPrice } from "../../utils";
import {
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
} from "../../redux/slices/orderSlice";
import StepComponent from "../../components/StepComponent/StepComponent";
import ModalComponent from "../../components/ModalComponent";
import { Form } from "antd";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import InputComponent from "../../components/InputComponent/InputComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const [auth, setAuth] = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleRemoveAllOrder = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

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

  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      toast.error("Vui lòng chọn sản phẩm");
    } else if (
      !auth?.user?.name ||
      !auth?.user?.phone ||
      !auth?.user?.address ||
      !auth?.user?.city
    ) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: auth?.user?.name,
        phone: auth?.user?.phone,
        address: auth?.user?.address,
        city: auth?.user?.city,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateInforUser = async () => {
    const { name, address, phone, city } = stateUserDetails;
    if (name && address && city && phone) {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth//update-user/${auth?.user?._id}`,
        { ...stateUserDetails }
      );
      if (data?.success) {
        setAuth({
          ...auth,
          user: data?.user,
        });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.user;
        localStorage.setItem("auth", JSON.stringify(ls));
        setIsOpenModalUpdateInfo(false);
      }
    }
  };

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000đ",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000đ đến dưới 500.000đ",
    },
    {
      title: "Free ship",
      description: "Trên 500.000đ",
    },
  ];

  return (
    <Layout>
      <div style={{ width: "100%", height: "100vh", background: "#f5f5fa" }}>
        <div className="container">
          <h3>Giỏ hàng</h3>
          <div className="row">
            <div className="col-9">
              <WrapperStyleHeaderDilivery>
                <StepComponent
                  items={itemsDelivery}
                  current={
                    deliveryPriceMemo === 10000
                      ? 1
                      : deliveryPriceMemo === 20000
                      ? 0
                      : order.orderItemsSlected.length === 0
                      ? 0
                      : 2
                  }
                />
              </WrapperStyleHeaderDilivery>
              <WrapperStyleHeader>
                <span style={{ display: "inline-block", width: "390px" }}>
                  <CustomCheckbox
                    onChange={handleOnchangeCheckAll}
                    checked={listChecked?.length === order?.orderItems?.length}
                  />
                  <span>Tất cả sản phẩm</span>
                </span>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveAllOrder}
                  />
                </div>
              </WrapperStyleHeader>
              <WrapperListOrder>
                {order?.orderItems?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.product}>
                      <div
                        style={{
                          width: "390px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <CustomCheckbox
                          value={order?.product}
                          onChange={onChange}
                          checked={listChecked.includes(order?.product)}
                        />
                        <img
                          src={order.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                          alt="logo"
                        />
                        <div
                          style={{
                            width: 260,
                            wordBreak: "break-all",
                          }}
                        >
                          {order.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            {convertPrice(order.price)}
                          </span>
                        </span>
                        <WrapperCountOrder>
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "decrease",
                                order?.product,
                                order?.amount === 1
                              )
                            }
                          >
                            <MinusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          </button>
                          <WrapperInputNumber
                            size="small"
                            value={order?.amount}
                            min={1}
                            max={order?.quantity}
                          />
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "increase",
                                order?.product,
                                order?.amount === order?.countInstock
                              )
                            }
                          >
                            <PlusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          </button>
                        </WrapperCountOrder>
                        <span
                          style={{
                            color: "rgb(255, 66, 78)",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {convertPrice(order?.price * order?.amount)}
                        </span>
                        <DeleteOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteOrder(order?.product)}
                        />
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperListOrder>
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
                      onClick={handleChangeAddress}
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
                textbutton={"Mua hàng"}
                onClick={() => handleAddCard()}
              >
                Mua hàng
              </button>
            </div>
          </div>
        </div>
        <ModalComponent
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onOk={handleUpdateInforUser}
          onCancel={handleCancleUpdate}
        >
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
          </Form>
        </ModalComponent>
      </div>
    </Layout>
  );
};

export default OrderPage;
