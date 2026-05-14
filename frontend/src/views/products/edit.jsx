/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Api from "../../services/api";
import { handleErrors } from "../../utils/handleErrors";
import { useLoading } from "../../states/loading";

export default function ProductEdit({ fetchData, productId }) {
  const { loading, setLoading } = useLoading();
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);

  const fileInputRef = useRef(null); // Create a ref for the file input
  const modalRef = useRef(null); // Create a ref for the modal

  const fetchCategories = async () => {
    await Api.get("/categories-all").then((response) => {
      setCategories(response.data.data);
    });
  };

  const fetchProductById = async () => {
    try {
      const response = await Api.get(`/products/${productId}`);

      setBarcode(response.data.data.barcode);
      setTitle(response.data.data.title);
      setDescription(response.data.data.description);
      setBuyPrice(response.data.data.buy_price);
      setSellPrice(response.data.data.sell_price);
      setStock(response.data.data.stock);
      setCategoryId(response.data.data.category_id);
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

  const updateProduct = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("barcode", barcode);
      formData.append("image", image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("buy_price", buyPrice);
      formData.append("sell_price", sellPrice);
      formData.append("stock", stock);
      formData.append("category_id", categoryId);

      const response = await Api.put(`/products/${productId}`, formData);
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

      fileInputRef.current.value = "";

      setBarcode("");
      setTitle("");
      setImage("");
      setDescription("");
      setBuyPrice("");
      setSellPrice("");
      setStock("");
      setCategoryId("");
      setErrors({});
    } catch (e) {
      handleErrors(e.response.data, setErrors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    setLoading(false);
  }, []);

  return (
    <>
      <a
        href="#"
        onClick={() => fetchProductById()}
        className="btn rounded d-sm-inline-block"
        data-bs-toggle="modal"
        data-bs-target={`#modal-edit-product-${productId}`}
      >
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-product-${productId}`}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={updateProduct}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
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
                      <label className="form-label">Image</label>
                      <input
                        type="file"
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
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Barcode</label>
                      <input
                        tabIndex={-1}
                        type="text"
                        className="form-control"
                        value={barcode}
                        readOnly
                      />
                      {errors.barcode && (
                        <div className="alert alert-danger mt-2">
                          {errors.barcode}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Product Name"
                      />
                      {errors.title && (
                        <div className="alert alert-danger mt-2">
                          {errors.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <div className="alert alert-danger mt-2">
                          {errors.category_id}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Enter Stock Product"
                      />
                      {errors.stock && (
                        <div className="alert alert-danger mt-2">
                          {errors.stock}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
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
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Buy Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        placeholder="Enter Buy Price"
                      />
                      {errors.buy_price && (
                        <div className="alert alert-danger mt-2">
                          {errors.buy_price}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Sell Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        placeholder="Enter Sell Price"
                      />
                      {errors.sell_price && (
                        <div className="alert alert-danger mt-2">
                          {errors.sell_price}
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
