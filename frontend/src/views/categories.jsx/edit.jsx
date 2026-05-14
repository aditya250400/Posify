/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Api from "../../services/api";
import { handleErrors } from "../../utils/handleErrors";
import { useLoading } from "../../states/loading";

export default function CategoryEdit({ fetchData, categoryId }) {
  const { loading, setLoading } = useLoading();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const fetchCategory = async () => {
    try {
      const response = await Api.get(`/categories/${categoryId}`);

      setName(response.data.data.name);
      setDescription(response.data.data.description);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileChange = (e) => {
    const imageData = e.target.files[0];

    if (!imageData.type.match("image.*")) {
      fileInputRef.current.value = "";
      setImage("");
      toast.error("Format File not Supported!", {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return;
    }
    setImage(imageData);
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);

      const response = await Api.put(`/categories/${categoryId}`, formData);

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
      // eslint-disable-next-line no-undef
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      fetchData();

      fileInputRef.current.value = "";
      setImage("");
      setName("");
      setDescription("");
      setErrors({});
    } catch (e) {
      console.log(e);
      handleErrors(e.response.data, setErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a
        href="#"
        onClick={() => fetchCategory()}
        className="btn rounded"
        data-bs-toggle="modal"
        data-bs-target={`#modal-edit-category-${categoryId}`}
      >
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-category-${categoryId}`}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={updateCategory}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
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
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Enter Category Name"
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
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                      ></textarea>
                      {errors.description && (
                        <div className="alert alert-danger mt-2">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      {errors.image && (
                        <div className="alert alert-danger mt-2">
                          {errors.image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  className="btn me-auto rounded"
                  data-bs-dismiss="modal"
                  href="#"
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
