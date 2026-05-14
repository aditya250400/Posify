import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import DeleteButton from "../../components/DeleteButton";
import CustomersCreate from "./create";
import CustomersEdit from "./edit";

export default function CustomersIndex() {
  const [customers, setCustomers] = useState([]);
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
        `/customers?page=${page}&search=${keywords}`,
      );

      setCustomers(response.data.data);

      setPagination(() => ({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.totalCustomers,
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
              <div className="page-title">Customers</div>
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
                <CustomersCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search by customer name"
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
                        <th>Customer Name</th>
                        <th>No. Telp</th>
                        <th>Address</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 ? (
                        customers.map((customer, index) => (
                          <tr key={index}>
                            <td data-label="Customer Name">{customer.name}</td>
                            <td className="text-muted" data-label="No. Telp">
                              {customer.no_telp}
                            </td>
                            <td className="text-muted" data-label="Address">
                              {customer.address}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <CustomersEdit
                                  id={customer.id}
                                  fetchData={fetchData}
                                />
                                <DeleteButton
                                  id={customer.id}
                                  endpoint="/customers"
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
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
