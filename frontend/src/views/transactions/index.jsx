import { useState, useEffect, useRef } from "react";
import LayoutAdmin from "../../layouts/admin";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import { useLoading } from "../../states/loading";
import ProductList from "../../components/ProductList";
import CategoryList from "../../components/CategoryList";
import OrderItemList from "../../components/OrderItemList";
import moneyFormat from "../../utils/moneyFormat";
import Payment from "./components/Payments";

export default function TransactionsIndex() {
  const { loading, setLoading } = useLoading();
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, setCurrentCategoryId] = useState(null);
  const [carts, setCarts] = useState([]);
  const [totalCarts, setTotalCarts] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });
  const searchInputRef = useRef(null);

  const fetchProducts = async (pageNumber) => {
    try {
      const page = pageNumber ? pageNumber : pagination.currentPage;

      const response = await Api.get(`/products?page=${page}&limit=9`);
      setProducts(response.data.data);
      console.log(response.data);

      setPagination({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.totalPages,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await Api.get(`/categories-all`);
      setCategories(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await Api.post(`/products-by-barcode`, { barcode });
      setProducts(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategoryId = async (categoryId, pageNumber) => {
    try {
      const page = pageNumber ? pageNumber : pagination.currentPage;

      const response = await Api.get(
        `/products-by-category/${categoryId}?page=${page}&limit=9`,
      );
      setProducts(response.data.data);

      setPagination({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.total,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCarts = async () => {
    try {
      const response = await Api.get("/carts");
      setCarts(response.data.data);
      setTotalCarts(response.data.totalPrice);
    } catch (e) {
      console.log(e);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setBarcode(e.target.value);

    fetchProductByBarcode(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCarts();

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  return (
    <LayoutAdmin>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-8 mb-3">
              {/* Search and Scan Barcode */}
              <form onSubmit={searchHandler} autoComplete="off" noValidate>
                <div className="input-icon">
                  <span className="input-icon-addon">
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
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Scan Barcode"
                    value={barcode}
                    onChange={(e) => searchHandler(e)}
                    ref={searchInputRef}
                  />
                </div>
              </form>
              {/* Category List */}
              <CategoryList
                categories={categories}
                fetchProducts={fetchProducts}
                fetchProductByCategoryId={fetchProductsByCategoryId}
                setCurrentCategoryId={setCurrentCategoryId}
              />

              {/* Product List */}
              <ProductList products={products} fetchCarts={fetchCarts} />

              {/* Pagination */}
              <div className="row mt-3">
                <PaginationComponent
                  currentPage={pagination.currentPage}
                  perPage={pagination.perPage}
                  total={pagination.total}
                  onChange={(pageNumber) => fetchProducts(pageNumber)}
                  position="center"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-header p-3">
                  <h3>Order Items</h3>
                </div>
                <div className="card-body scrollable-card-body p-0">
                  {/* Order Items */}
                  <OrderItemList carts={carts} fetchCarts={fetchCarts} />
                </div>
                <div className="card-body">
                  <div className="mt-3">
                    <h3 className="float-end">{moneyFormat(totalCarts)}</h3>
                    <h3 className="mb-0">Total ({carts.length} Items)</h3>
                  </div>
                  <hr />
                  <Payment totalCarts={totalCarts} fetchCarts={fetchCarts} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
