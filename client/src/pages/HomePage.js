import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
// import { useAuth } from "../context/auth";
import axios from "axios";
import CardComponent from "../components/CardComponent/CardComponent";
import { Radio, Space } from "antd";
import "../styles/HomePageStyle.css";
// import CircularProgress from '@mui/material/CircularProgress'
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import logo from "../assets/images/not-found.png";
const HomePage = () => {
  // const [auth, setAuth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("");
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState("");
  const [radio, setRadio] = useState([]);

  const [loading, setLoading] = useState(true);

  const Prices = [
    {
      _id: 0,
      name: "Dưới 2.000.000",
    },
    {
      _id: 1,
      name: "2.000.000 -> 5.000.000",
    },
    {
      _id: 2,
      name: "5.000.000 -> 24.000.000",
    },
    {
      _id: 3,
      name: "Trên 24.000.000",
    },
  ];

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/getall-category`
      );
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/getall-product`
      );
      if (data.success) {
        setProducts(data.allProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (c) => {
    setLoading(true);
    setChecked(c._id);
    setActive(c.name);
  };

  const onChange = (e) => {
    setLoading(true);
    if (e.target.value === 0) {
      setRadio([0, 2000000]);
    }
    if (e.target.value === 1) {
      setRadio([2000000, 5000000]);
    }
    if (e.target.value === 2) {
      setRadio([5000000, 24000000]);
    }
    if (e.target.value === 3) {
      setRadio([24000000, 1000000000]);
    }
    console.log("radio", radio);
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      getAllProduct();
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [handleFilter, onChange]);

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          background: "rgb(239, 239, 239)",
          height: "700px",
        }}
        className="homepage"
      >
        <div className="container">
          <div className="row" style={{ paddingTop: "20px" }}>
            <div className="col-3">
              <div style={{ marginBottom: "16px" }}>
                <ul
                  class="nav flex-column"
                  style={{
                    backgroundColor: "rgb(255, 255, 255)",
                    padding: "12px 8px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ color: "#0F233C" }}>Danh mục</div>
                  {categories?.map((c) => (
                    <li
                      className="nav-item active d-flex align-items-center gap-2"
                      style={{ padding: "7px 16px", cursor: "pointer" }}
                      onClick={() => {
                        handleFilter(c);
                      }}
                    >
                      <div>
                        <img
                          src={c.image}
                          alt={c.name}
                          height={"30px"}
                          className="img img-responsive"
                        ></img>
                      </div>
                      <p
                        style={{
                          fontWeight: "400",
                          fontSize: "14px",
                          marginBottom: "0",
                        }}
                        className={active === `${c.name}` ? "nav-active" : ""}
                      >
                        {c.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <ul
                  class="nav flex-column"
                  style={{
                    backgroundColor: "rgb(255, 255, 255)",
                    padding: "12px 8px",
                    borderRadius: "8px",
                  }}
                >
                  <div>Giá</div>
                  <Radio.Group onChange={onChange}>
                    <Space direction="vertical">
                      {Prices?.map((p) => (
                        <div key={p._id}>
                          <Radio value={p._id}>{p.name}</Radio>
                        </div>
                      ))}
                    </Space>
                  </Radio.Group>
                </ul>
              </div>
              <div>
                <button
                  size={40}
                  style={{
                    background: "#ea1b25",
                    height: "48px",
                    width: "100%",
                    border: "none",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                  textbutton={"RESET FILTER"}
                  onClick={() => window.location.reload()}
                >
                  RESET FILTER
                </button>
              </div>
            </div>
            {loading ? (
              <div className="col-9 d-flex align-items-center justify-content-center">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 50,
                      }}
                      spin
                    />
                  }
                />
              </div>
            ) : (
              <div
                className="col-9"
                // style={{
                //   display: "flex",
                //   flexDirection: "column",
                //   justifyContent: "space-between",
                // }}
              >
                {!products?.length ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ marginTop: "100px" }}
                  >
                    <img
                      src={logo}
                      alt="logo"
                      style={{ width: "8.375rem" }}
                    ></img>
                    <div
                      style={{
                        fontSize: "1.125rem",
                        color: "rgba(0, 0, 0, .54)",
                      }}
                    >
                      Không tìm thấy sản phẩm bạn cần tìm trong Shop này
                    </div>
                  </div>
                ) : (
                  <div
                    className="d-flex flex-wrap"
                    style={{
                      gap: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    {products.map((product) => {
                      return (
                        <CardComponent
                          key={product._id}
                          quantity={product.quantity}
                          description={product.description}
                          image={product.image}
                          name={product.name}
                          price={product.price}
                          rating={product.rating}
                          category={product.category}
                          selled={product.selled}
                          id={product._id}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
