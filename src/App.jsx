import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMockData } from "./mockData";
import styles from "./App.module.css";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const observerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { datas, isEnd: end } = await getMockData(page);

      setProducts((prevProducts) => {
        const newProducts = datas.filter(
          (newProduct) =>
            !prevProducts.some(
              (product) => product.productId === newProduct.productId
            )
        );
        return [...prevProducts, ...newProducts];
      });

      setIsEnd(end);

      const newTotalPrice = datas.reduce(
        (acc, product) => acc + product.price,
        0
      );
      setTotalPrice((prevTotal) => prevTotal + newTotalPrice);

      setLoading(false);
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading && !isEnd) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, isEnd]);

  return (
    <>
      <div className={styles.total}>
        <h1>Total Price: ${totalPrice}</h1>
      </div>

      <div className={styles.separator}></div>

      <ul className={styles.list}>
        {products.map((product) => (
          <li key={product.productId} className={styles.item}>
            <div className={styles.first}>
              <div className={styles.name}>{product.productName}</div>
              <div className={styles.price}>${product.price}</div>
            </div>
            <div className={styles.info}>{product.boughtDate}</div>
          </li>
        ))}
      </ul>

      {loading && <p className={styles.loading}>Loading...</p>}

      <div
        ref={observerRef}
        style={{ height: "20px", backgroundColor: "transparent" }}
      ></div>
      {isEnd && <p>No more produts</p>}
    </>
  );
}

export default App;
