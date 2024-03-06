import React from "react";
import Layout from "../components/Layout/Layout";
import ProductDetailsComponent from "../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  return (
    <Layout>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "100%",
        }}
      >
        <ProductDetailsComponent />
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
