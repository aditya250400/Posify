/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Api from "../../../services/api";
import moneyFormat from "../../../utils/moneyFormat";
import { useLoading } from "../../../states/loading";

export default function Payment({ totalCarts, fetchCarts }) {
  const { loading, setLoading } = useLoading();
  const [grandTotal, setGrandTotal] = useState(totalCarts);
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);
  const [discount, setDiscount] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  function calculateDiscount(e) {
    setDiscount(e.target.value);
    setGrandTotal(totalCarts - e.target.value);
    setCash(0);
    setChange(0);
  }

  function calculateChange(e) {
    setCash(e.target.value);
    setChange(e.target.value - grandTotal);
  }

  function calculateGrandTotal() {
    setGrandTotal(totalCarts);
  }

  const fetchCustomers = async () => {
    try {
      const response = await Api.get("/customers-all");
      setCustomers(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const storeTransaction = async () => {
    setLoading(true);

    try {
      const response = await Api.post("/transactions", {
        customer_id: selectedCustomer.value || null,
        discount: parseInt(discount) || 0,
        cash: parseInt(cash),
        change: parseInt(change),
        grand_total: parseInt(grandTotal),
      });

      toast.success(response.data.meta.message, {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      fetchCarts();

      const receiptWindow = window.open(
        `/transactions/print?invoice=${response.data.data.invoice}`,
        "_blank",
      );
      receiptWindow.onload = function () {
        receiptWindow.print();
        receiptWindow.onafterprint = function () {
          receiptWindow.close();
        };
      };
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateGrandTotal();
  }, [totalCarts]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <button
        className="btn btn-warning w-100 rounded"
        data-bs-toggle="modal"
        data-bs-target="#modal-pay"
        disabled={totalCarts === 0}
      >
        Pay
      </button>

      <div
        className="modal modal-blur fade"
        id="modal-pay"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Cash</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="card rounded bg-muted-lt">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-4">
                      <h4 className="fw-bold">GRAND TOTAL</h4>
                    </div>
                    <div className="col-md-8 col-8 text-end">
                      <h2 className="fw-bold">{moneyFormat(grandTotal)}</h2>
                      <div>
                        <hr />
                        <h3 className="text-success">
                          Change : <strong>{moneyFormat(change)}</strong>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-2 mt-3">
                <div className="col-md-6">
                  <label className="mb-1">Customer</label>
                  <Select
                    options={customers}
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mb-1">Discount (Rp.)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Discount (Rp.)"
                    value={discount}
                    onChange={(e) => calculateDiscount(e)}
                  />
                </div>
              </div>
              <div className="row mb-2 mt-3">
                <div className="col-md-12">
                  <label className="mb-1">Cash (Rp.)</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Cash (Rp.)"
                    value={cash}
                    onChange={(e) => calculateChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-auto rounded"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={storeTransaction}
                disabled={cash < grandTotal || grandTotal === 0 || loading}
                className="btn btn-primary rounded"
                data-bs-dismiss="modal"
              >
                {loading ? (
                  <div
                    className="spinner-border text-white"
                    role="status"
                  ></div>
                ) : (
                  "Pay Order + Print"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
