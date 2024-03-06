import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { FaSearch, FaPlus, FaRegEdit } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import ModalComponent from "../../components/ModalComponent";
import { getBase64 } from "../../utils";
import { Upload, Button } from "antd";
import styled from "styled-components";

const CreateCatogery = () => {
  const [rowSelected, setRowSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const [updatedname, setUpdatedName] = useState("");
  const [updatedimage, setUpdatedImage] = useState("");

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

  const getSingleCategory = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/single-category/${id}`
      );
      if (data?.success) {
        setUpdatedName(data?.category?.name);
        setUpdatedImage(data?.category?.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleDelete = () => {
    setIsModalOpenDelete(true);
  };

  const handleCreate = () => {
    setIsModalOpenCreate(true);
  };

  const handleUpdate = () => {
    setIsModalOpenUpdate(true);
  };

  const handleOkDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`The type "${rowSelected?.name}" is deleted `);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsModalOpenDelete(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category/`,
        { name, image }
      );
      if (data?.success) {
        toast.success(`The type "${name}" is created`);
        getAllCategory();
        setIsModalOpenCreate(false);
        setName("");
        setImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Please upload product type image ");
    }
  };

  const handleCancelCreate = () => {
    setIsModalOpenCreate(false);
    setName("");
    setImage("");
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${rowSelected._id}`,
        { name: updatedname, image: updatedimage }
      );
      if (data?.success) {
        toast.success(`This product type is updated successfully`);
        setRowSelected(null);
        setUpdatedName("");
        setUpdatedImage("");
        getAllCategory();
        setIsModalOpenUpdate(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong in input form");
    }
  };

  const handleCancelUpdate = () => {
    setIsModalOpenUpdate(false);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setImage(file.preview);
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setUpdatedImage(file.preview);
  };

  console.log("row", rowSelected);
  return (
    <Layout>
      <AdminMenu>
        <h1>Manage Category</h1>
        <div className="d-flex justify-content-between">
          <button type="button" class="btn btn-primary" onClick={handleCreate}>
            <span>
              <FaPlus className="me-1" />
              Create Category
            </span>
          </button>
          <ModalComponent
            title="CREATE CATEGORY FORM"
            open={isModalOpenCreate}
            onCancel={handleCancelCreate}
            footer={null}
          >
            <form onSubmit={handleSubmitCreate}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new category"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div className="mb-3">
                <WrapperUploadFile
                  onChange={handleOnchangeAvatar}
                  maxCount={1}
                  required
                >
                  <Button>Upload Image</Button>
                  {image && (
                    <img
                      src={image}
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
                <button className="btn btn-primary float-end" type="Submit">
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
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr>
                  <td key={item._id}>{item.name}</td>
                  <td>
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => {
                        handleUpdate();
                        getSingleCategory(item._id);
                        setRowSelected(item);
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
                        setRowSelected(item);
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
            title="Delete Category Form"
            open={isModalOpenDelete}
            onOk={() => handleOkDelete(rowSelected._id)}
            onCancel={handleCancelDelete}
          >
            <p>Do you want to delete the type "{rowSelected?.name}" ?</p>
          </ModalComponent>
          <ModalComponent
            title="Update Category Form"
            open={isModalOpenUpdate}
            footer={null}
            onCancel={handleCancelUpdate}
          >
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setUpdatedName(e.target.value)}
                  value={updatedname}
                  required
                />
              </div>
              <div className="mb-3">
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                  required
                >
                  <Button>Upload Image</Button>
                  {updatedimage && (
                    <img
                      src={updatedimage}
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
                <button className="btn btn-primary float-end" type="Submit">
                  Update
                </button>
              </div>
            </form>
          </ModalComponent>
        </div>
      </AdminMenu>
    </Layout>
  );
};

export default CreateCatogery;
