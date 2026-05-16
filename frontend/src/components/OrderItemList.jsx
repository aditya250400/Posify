/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import Api from "../services/api";
import moneyFormat from "../utils/moneyFormat";
import toast from "react-hot-toast";

export default function OrderItemList({ carts, fetchCarts }) {
  const deleteCart = async (id) => {
    try {
      const response = await Api.delete(`/carts/${id}`);
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
    <div className="card-body scrollable-card-body">
      <div className="row">
        {carts.map((cart) => (
          <div className="col-12 mb-2" key={cart.id}>
            <div className="card rounded">
              <div className="card-body d-flex align-items-center">
                <img
                  width={50}
                  height={50}
                  className="me-3 rounded"
                  alt={cart.product.title}
                  src={`${import.meta.env.VITE_APP_IMAGEBASEURL}/${cart.product.image}`}
                />
                <div className="flex-fill">
                  <h4 className="mb-0">{cart.product.title}</h4>
                  <p className="text-success mb-0 mt-1">
                    {moneyFormat(cart.price)}
                  </p>
                  <hr className="mb-1 mt-1" />
                  <p className="text-muted mb-0">Qty: {cart.qty}</p>
                </div>
                <button
                  className="btn btn-danger ms-3 rounded p-2 pt-1 pb-1"
                  onClick={() => deleteCart(cart.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
