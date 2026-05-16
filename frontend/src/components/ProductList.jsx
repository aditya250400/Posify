/* eslint-disable react/prop-types */
import Api from "../services/api";
import moneyFormat from "../utils/moneyFormat";
import Barcode from "./Barcode";
import toast from "react-hot-toast";

export default function ProductList({ products, fetchCarts }) {
  const addToCart = async (product) => {
    try {
      const response = await Api.post("/carts", {
        product_id: product.id,
        qty: 1,
        price: product.sell_price,
      });

      toast.success(`${response.data.meta.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      fetchCarts();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="row mt-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-6 col-lg-4" key={index}>
              <div className="card card-link card-link-pop mt-3 rounded">
                <div className="ribbon ">
                  <h4>{moneyFormat(product.sell_price)}</h4>
                </div>
                <div className="card-body text-center">
                  <img
                    src={`${import.meta.env.VITE_APP_IMAGEBASEURL}/${product.image}`}
                    alt={product.title}
                    className=" rounded"
                  />
                  <h4 className="mb-0 mt-2">{product.title}</h4>
                  <Barcode
                    value={product.barcode}
                    format={"CODE39"}
                    lineColor={"#000"}
                    width={1}
                    height={20}
                    fontSize={12}
                  />
                  <button
                    className="btn btn-primary mt-3 w-100 rounded"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-danger mb-0">Product not available</div>
        )}
      </div>
    </>
  );
}
