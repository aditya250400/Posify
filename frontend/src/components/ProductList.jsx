/* eslint-disable react/prop-types */
import moneyFormat from "../utils/moneyFormat";
import Barcode from "./Barcode";

export default function ProductList({ products }) {
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
