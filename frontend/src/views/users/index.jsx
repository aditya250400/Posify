import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import DeleteButton from "../../components/DeleteButton";
import UsersCreate from "./create";
import UsersEdit from "./edit";

export default function UsersIndex() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });

  const [keywords, setKeywords] = useState("");

  const fetchData = async (pageNumber, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    try {
      const response = await Api.get(`/users?page=${page}&search=${keywords}`);

      setUsers(response.data.data);

      setPagination(() => ({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.totalUsers,
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
              <div className="page-title">Users</div>
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
                <UsersCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search by user name"
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
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={index}>
                            <td data-label="Full Name">{user.name}</td>
                            <td
                              className="text-muted"
                              data-label="Email Address"
                            >
                              {user.email}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <UsersEdit id={user.id} fetchData={fetchData} />
                                <DeleteButton
                                  id={user.id}
                                  endpoint="/users"
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
