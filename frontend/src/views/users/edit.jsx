/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Api from "../../services/api";
import { handleErrors } from "../../utils/handleErrors";
import { useLoading } from "../../states/loading";

export default function UsersEdit({ fetchData, id }) {
  const { loading, setLoading } = useLoading();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  const fetchUserById = async () => {
    try {
      const response = await Api.get(`/users/${id}`);

      setName(response.data.data.name);
      setEmail(response.data.data.email);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUser = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await Api.put(`/users/${id}`, {
        name,
        email,
        password,
        confirmPassword,
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
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (e) {
      if (e.response.data.meta) {
        setErrors({
          ...errors,
          confirmPassword: e.response.data.meta.message,
        });
      } else {
        handleErrors(e.response.data, setErrors);
      }
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
        onClick={fetchUserById}
        data-bs-target={`#modal-edit-user-${id}`}
      >
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-user-${id}`}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={updateUser}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
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
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Full Name"
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
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email Address"
                      />
                      {errors.email && (
                        <div className="alert alert-danger mt-2">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                      {errors.password && (
                        <div className="alert alert-danger mt-2">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Password Confirmation
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter Confirm Password"
                      />
                      {errors.confirmPassword && (
                        <div className="alert alert-danger mt-2">
                          {errors.confirmPassword}
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
