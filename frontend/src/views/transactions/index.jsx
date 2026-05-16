import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import { useLoading } from "../../states/loading";
import ProductList from "../../components/ProductList";

export default function TransactionsIndex() {
  const { loading, setLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });

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

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <LayoutAdmin>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-8 mb-3">
              {/* Search and Scan Barcode */}

              {/* Category List */}

              {/* Product List */}
              <ProductList products={products} />
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
                </div>
                <div className="card-body">
                  <div className="mt-3">
                    <h3 className="float-end"></h3>
                    <h3 className="mb-0">Total</h3>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
