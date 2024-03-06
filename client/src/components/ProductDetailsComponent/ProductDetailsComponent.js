import React, { useEffect, useState } from "react";
import { Rate } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
} from "./style";
import axios from "axios";
import { useParams } from "react-router-dom";
import { convertPrice } from "../../utils";
import { useDispatch } from "react-redux";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const ProductDetailsComponent = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [numProduct, setNumProduct] = useState(1);
  const [product, setProduct] = useState({});
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/single-product/${params.id}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.id) {
      getSingleProduct();
    }
  }, [params?.id]);

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleAddOrderProduct = () => {
    if (!auth?.user?._id) {
      navigate("/login", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: product?.name,
            amount: numProduct,
            image: product?.image,
            price: product?.price,
            product: product?._id,
            countInstock: product?.quantity,
          },
        })
      );
      toast.success("Thêm vào giỏ hàng thành công!");
    }
  };
  return (
    <div className="container">
      <div
        className="row"
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          paddingTop: "20px",
          paddingBottom: "50px",
        }}
      >
        <div className="col-5">
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <img
              className="card-img-top"
              src={product.image}
              alt="logo"
              style={{ border: "1px solid rgb(235, 235, 240)" }}
            ></img>
          </div>
        </div>
        <div className="col-7">
          <div
            style={{
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <WrapperStyleNameProduct>{product.name}</WrapperStyleNameProduct>
            <div>
              <Rate allowHalf value={product.rating} />
              <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
              <WrapperPriceTextProduct>
                {convertPrice(product.price)}
              </WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
              <span>Giao đến</span>
              <span className="address">HCM</span>
              <span className="change-address">Đổi địa chỉ</span>
            </WrapperAddressProduct>

            <div
              style={{
                margin: "10px 0 20px",
                padding: "10px 0",
                borderTop: "1px solid #e5e5e5",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              <div style={{ marginBottom: "10px" }}>Số lượng</div>
              <WrapperQualityProduct>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleChangeCount("decrease", numProduct === 1);
                  }}
                >
                  <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
                <WrapperInputNumber
                  size="small"
                  value={numProduct}
                  defaultValue={1}
                  min={1}
                  max={product?.quantity}
                  onChange={onChange}
                />
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleChangeCount(
                      "increase",
                      numProduct === product?.quantity
                    );
                  }}
                >
                  <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
              </WrapperQualityProduct>
            </div>
            <div style={{ display: "flex", aliggItems: "center", gap: "12px" }}>
              <button
                size={40}
                style={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                textbutton={"Chọn mua"}
              >
                Chọn mua
              </button>
              <button
                size={40}
                style={{
                  background: "#fff",
                  height: "48px",
                  width: "220px",
                  border: "1px solid rgb(13, 92, 182)",
                  borderRadius: "4px",
                  color: "rgb(13, 92, 182)",
                  fontSize: "15px",
                }}
                textbutton={"Thêm vào giỏ hàng"}
                onClick={handleAddOrderProduct}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
