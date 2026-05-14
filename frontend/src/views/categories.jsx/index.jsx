import LayoutAdmin from "../../layouts/admin";
import { useState, useEffect } from "react";
import Api from "../../services/api";
import PaginationComponent from "../../components/Pagination";
import { useLoading } from "../../states/loading";
import CategoryCreate from "./create";
import CategoryEdit from "./edit";
import DeleteButton from "../../components/DeleteButton";

export default function CategoriesIndex() {
  const { loading, setLoading } = useLoading();

  const [categories, setCategories] = useState([]);
  const [keywords, setKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 0,
    total: 0,
  });

  const fetchData = async (pageNumber, keywords = "") => {
    setLoading(true);

    const page = pageNumber ? pageNumber : pagination.currentPage;
    try {
      const response = await Api.get(
        `/categories?page=${page}&search=${keywords}`,
      );

      setCategories(response.data.data);
      setPagination(() => ({
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.totalCategories,
      }));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const searchHandler = () => {
    fetchData(1, keywords);
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      searchHandler();
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      setLoading(false);
      setCategories([]);
    };
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-header ">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-title">Categories</div>
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
                <CategoryCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  value={keywords}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search by category name"
                />
                <button
                  className="btn btn-md btn-primary"
                  onClick={searchHandler}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <tr key={index}>
                            <td data-label="Category Name">
                              <div className="d-flex align-items-center py-1">
                                <span
                                  className="avatar me-2"
                                  style={{
                                    backgroundImage: `url(${import.meta.env.VITE_APP_IMAGEBASEURL}/${category.image})`,
                                  }}
                                ></span>
                                <div className="flex-fill">
                                  <div className="font-weight-medium">
                                    {category.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted" data-label="Description">
                              {category.description}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <CategoryEdit
                                  categoryId={category.id}
                                  fetchData={fetchData}
                                />
                                <DeleteButton
                                  id={category.id}
                                  endpoint="/categories"
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">
                            <div className="alert alert-danger-mb-0">
                              Data Belum Tersedia
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
