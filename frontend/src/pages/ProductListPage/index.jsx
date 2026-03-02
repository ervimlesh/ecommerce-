import React from "react";
import { useLocation } from "react-router-dom";

import ClothingAndAccessories from "./ClothingAndAccessories";
import ProductPage from "./ProductPage";
import ProductStore from "./ProductStore";
import Layout from "../../components/Layout/Layout";

// Extract query params from URL
const getParams = (query) => {
  if (query) {
    const queryString = query.split("?")[1];
    if (queryString && queryString.length > 0) {
      const params = queryString.split("&");
      const paramsObj = {};
      params.forEach((param) => {
        const keyValue = param.split("=");
        paramsObj[keyValue[0]] = decodeURIComponent(keyValue[1]);
      });
      return paramsObj;
    }
  }
  return {};
};

const ProductListPage = () => {
  const location = useLocation();

  const renderProduct = () => {
    const params = getParams(location.search);

    console.log("params", params);
    let content = null;

    switch (params.type) {
      case "store":
        content = <ProductStore />;
        break;
      case "page":
        content = <ProductPage />;
        break;
      default:
        content = <ClothingAndAccessories />;
    }

    return content;
  };

  return (
    <Layout>
      {" "}
      <div>{renderProduct()}</div>{" "}
    </Layout>
  );
};

export default ProductListPage;
