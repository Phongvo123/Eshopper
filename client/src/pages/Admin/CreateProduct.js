import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { FaSearch, FaPlus, FaRegEdit } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import ModalComponent from "../../components/ModalComponent";
import { Select, Upload, Button } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import styled from "styled-components";
import { getBase64 } from "../../utils";
import PaginationComponent from "../../components/paginationComponent/paginationComponent";
// import Pagination from "antd";
const { Option } = Select;

const CreateProduct = () => {
  const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    & .ant-upload-list-item-info {
      display: none;
    }
    & .ant-upload-list-item {
      display: none;
    }
  `;

  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const [rowSelected, setRowSelected] = useState("");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    category: "",
    quantity: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());
  const [page, setPage] = useState(1)
  const [totalProduct, setTotalProduct] = useState(1)

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
        `${process.env.REACT_APP_API}/api/v1/product/getall-product-pagination?page=${page}`
      );
      console.log("data", data);
      if (data.success) {
        setProducts(data.allProducts);
        setTotalProduct(data.totalProduct)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleProduct = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/single-product/${id}`
      );
      if (data?.success) {
        setStateProductDetails({
          name: data?.product?.name,
          price: data?.product?.price,
          description: data?.product?.description,
          rating: data?.product?.rating,
          image: data?.product?.image,
          category: data?.product?.category,
          quantity: data?.product?.quantity,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProduct();
  }, [page]);

  //CREATE A PRODUCT
  const handleCreate = () => {
    setIsModalOpenCreate(true);
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeCategory = (value) => {
    setStateProduct({
      ...stateProduct,
      category: value,
    });
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        {
          ...stateProduct,
        }
      );
      console.log("data", data);
      if (data?.success) {
        toast.success("Product Created Successfully");
        getAllProduct();
        setIsModalOpenCreate(false);
        setStateProduct({
          name: "",
          price: "",
          description: "",
          rating: "",
          image: "",
          category: "",
          quantity: "",
        });
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const handleCancelCreate = () => {
    setIsModalOpenCreate(false);
  };

  const handleDelete = () => {
    setIsModalOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //UPDATE PRODUCT
  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeCategoryDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      category: value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${rowSelected._id}`,
        {
          ...stateProductDetails,
        }
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        getAllProduct();
        setIsModalOpenUpdate(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const handleOkDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${pId}`
      );
      if (data.success) {
        toast.success(`Product is deleted`);
        getAllCategory();
        getAllProduct()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsModalOpenDelete(false);
  };

  const handleUpdate = () => {
    setIsModalOpenUpdate(true);
  };

  const handleCancelUpdate = () => {
    setIsModalOpenUpdate(false);
  };

  const handleChangePage = (current) => {
    setPage(current)
  };


  return (
    <Layout>
      <AdminMenu>
        <h1>Manage Product</h1>
        <div className="d-flex justify-content-between">
          <button type="button" class="btn btn-primary" onClick={handleCreate}>
            <span>
              <FaPlus className="me-1" />
              Create Product
            </span>
          </button>
          <ModalComponent
            title="CREATE PRODUCT FORM"
            open={isModalOpenCreate}
            footer={null}
            onCancel={handleCancelCreate}
          >
            <form onSubmit={handleSubmitCreate}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="form-control"
                  name="name"
                  value={stateProduct.name}
                  onChange={handleOnchange}
                  required
                />
              </div>
              <Select
                bordered={false}
                showSearch
                placeholder="Select a type product"
                className="form-control mb-3"
                onChange={(value) => handleOnchangeCategory(value)}
                required
              >
                {categories.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product price"
                  className="form-control"
                  name="price"
                  value={stateProduct.value}
                  onChange={handleOnchange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product quantity"
                  className="form-control"
                  name="quantity"
                  value={stateProduct.quantity}
                  onChange={handleOnchange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product rating"
                  className="form-control"
                  name="rating"
                  value={stateProduct.rating}
                  onChange={handleOnchange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  placeholder="Enter product description"
                  className="form-control"
                  name="description"
                  value={stateProduct.description}
                  onChange={handleOnchange}
                  required
                />
              </div>
              <div className="mb-3">
                <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button>Upload Image</Button>
                  {stateProduct?.image && (
                    <img
                      src={stateProduct?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </div>
              <div className="mb-3 p-3">
                <button type="Submit" className="btn btn-primary float-end">
                  Create
                </button>
              </div>
            </form>
          </ModalComponent>
          <div className="input-group" style={{ width: "30%" }}>
            <input
              type="text"
              className="form-control"
              placeholder="search..."
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
        </div>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div>
                      <img
                        src={p.image}
                        alt={p.name}
                        height={"70px"}
                        className="img img-responsive"
                      ></img>
                    </div>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name}</td>
                  <td>{p.price}</td>
                  <td>
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => {
                        handleUpdate();
                        getSingleProduct(p._id);
                        setRowSelected(p);
                      }}
                    >
                      <span>
                        <FaRegEdit />
                        Edit
                      </span>
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        handleDelete();
                        setRowSelected(p);
                      }}
                    >
                      <span>
                        <FaXmark />
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalComponent
            title="Delete Product Form"
            open={isModalOpenDelete}
            onOk={() => handleOkDelete(rowSelected._id)}
            onCancel={handleCancelDelete}
          >
            <p>Do you want to delete this product?</p>
          </ModalComponent>
          <ModalComponent
            title="Update Product Form"
            footer={null}
            open={isModalOpenUpdate}
            onCancel={handleCancelUpdate}
          >
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="form-control"
                  onChange={handleOnchangeDetails}
                  value={stateProductDetails.name}
                  name="name"
                  required
                />
              </div>
              <Select
                bordered={false}
                showSearch
                placeholder="Select a type product"
                className="form-control mb-3"
                onChange={(value) => handleOnchangeCategoryDetails(value)}
                value={stateProductDetails.category?.name}
              >
                {categories.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product price"
                  className="form-control"
                  onChange={handleOnchangeDetails}
                  value={stateProductDetails.price}
                  name="price"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product quantity"
                  className="form-control"
                  onChange={handleOnchangeDetails}
                  value={stateProductDetails.quantity}
                  name="quantity"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Enter product rating"
                  className="form-control"
                  onChange={handleOnchangeDetails}
                  value={stateProductDetails.rating}
                  name="rating"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  placeholder="Enter product description"
                  className="form-control"
                  onChange={handleOnchangeDetails}
                  value={stateProductDetails.description}
                  name="description"
                  required
                />
              </div>
              <div className="mb-3">
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                >
                  <Button>Upload Image</Button>
                  {stateProductDetails?.image && (
                    <img
                      src={stateProductDetails?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </div>
              <div className="mb-3 p-3">
                <button type="Submit" className="btn btn-primary float-end">
                  Update
                </button>
              </div>
            </form>
          </ModalComponent>
        </div>
        <div className="d-flex justify-content-end my-3">
        <PaginationComponent handleChangePage={handleChangePage} totalProduct={totalProduct}/>
        </div>
      </AdminMenu>
    </Layout>
  );
};
export default CreateProduct;
