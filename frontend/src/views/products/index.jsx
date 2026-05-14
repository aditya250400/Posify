import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import moneyFormat from "../../utils/moneyFormat";
import Barcode from "../../components/Barcode";
import ProductCreate from "./create";
import ProductEdit from "./edit";
import DeleteButton from "../../components/DeleteButton";
export default function ProductsIndex() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });

  const [keywords, setKeywords] = useState("");

  const fetchData = async (pageNumber, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    try {
      const response = await Api.get(
        `/products?page=${page}&search=${keywords}`,
      );

      setProducts(response.data.data);

      setPagination(() => ({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.totalProducts,
      }));
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchHandlder = () => {
    fetchData(1, keywords);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandlder();
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-header ">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-title">Products</div>
              <h2 className="page-pretitle">Page</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <div className="input-group">
                <ProductCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search by product name"
                />
                <button
                  onClick={searchHandlder}
                  className="btn btn-md btn-primary"
                >
                  SEARCH
                </button>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>Barcode</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>Stock</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <tr key={index}>
                            <td data-label="Barcode">
                              <Barcode
                                value={product.barcode}
                                format={"CODE39"}
                                lineColor={"#000"}
                                width={1}
                                height={20}
                                fontSize={10}
                              />
                            </td>
                            <td data-label="Category Name">
                              <div className="d-flex py-1 align-items-center">
                                <span
                                  className="avatar me-2"
                                  style={{
                                    backgroundImage: `url(${import.meta.env.VITE_APP_IMAGEBASEURL}/${product.image})`,
                                  }}
                                ></span>
                                <div className="flex-fill">
                                  <div className="font-weight-medium">
                                    {product.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted" data-label="Category">
                              {product.category.name}
                            </td>
                            <td data-label="Buy Price">
                              {moneyFormat(product.buy_price)}
                            </td>
                            <td data-label="Sell Price">
                              {moneyFormat(product.sell_price)}
                            </td>
                            <td data-label="Stock">{product.stock}</td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <ProductEdit
                                  productId={product.id}
                                  fetchData={fetchData}
                                />
                                <DeleteButton
                                  id={product.id}
                                  endpoint="/products"
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <div className="alert alert-danger mb-0">
                              Data Belum Tersedia!
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <PaginationComponent
                    currentPage={pagination.currentPage}
                    perPage={pagination.perPage}
                    total={pagination.total}
                    onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                    position="end"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
