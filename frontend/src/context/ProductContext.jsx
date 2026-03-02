import { createContext, useContext, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProductsByCategory = async (cid) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/products-by-cat?cid=${cid}`);
      if (res?.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products by category", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, getProductsByCategory }}>
      {children}
    </ProductContext.Provider>
  );
};
