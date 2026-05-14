/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Api from "../../services/api";
import { handleErrors } from "../../utils/handleErrors";
import { useLoading } from "../../states/loading";

export default function CustomersEdit({ fetchData, id }) {
  const { loading, setLoading } = useLoading();
  const [name, setName] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  const fetchCustomerById = async () => {
    try {
      const response = await Api.get(`/customers/${id}`);

      setName(response.data.data.name);
      setNoTelp(response.data.data.no_telp);
      setAddress(response.data.data.address);
    } catch (e) {
      console.log(e);
    }
  };

  const updateCustomer = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await Api.put(`/customers/${id}`, {
        name,
        no_telp: noTelp,
        address,
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

      const modalElement = modalRef.current;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      fetchData();

      setName("");
      setNoTelp("");
      setAddress("");
      setErrors({});
    } catch (e) {
      handleErrors(e.response.data, setErrors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <a
        href="#"
        className="btn rounded d-sm-inline-block"
        data-bs-toggle="modal"
        onClick={fetchCustomerById}
        data-bs-target={`#modal-edit-customer-${id}`}
      >
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-customer-${id}`}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={updateCustomer}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Customer</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Customer Name"
                      />
                      {errors.name && (
                        <div className="alert alert-danger mt-2">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">No. Telp</label>
                      <input
                        type="text"
                        className="form-control"
                        value={noTelp}
                        onChange={(e) => setNoTelp(e.target.value)}
                        placeholder="Enter No. Telp"
                      />
                      {errors.no_telp && (
                        <div className="alert alert-danger mt-2">
                          {errors.no_telp}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Address"
                      ></textarea>
                      {errors.address && (
                        <div className="alert alert-danger mt-2">
                          {errors.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  className="btn me-auto rounded"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </a>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary ms-auto rounded"
                >
                  {loading ? (
                    <div
                      className="spinner-border text-white"
                      role="status"
                    ></div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
