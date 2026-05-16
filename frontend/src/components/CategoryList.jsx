/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import useHorizontalScroll from "../utils/useHorizontalScroll";

export default function CategoryList({
  categories,
  fetchProducts,
  fetchProductByCategoryId,
  setCurrentCategoryId,
}) {
  const { scrollRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } =
    useHorizontalScroll();

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <a
            href="#"
            onClick={() => fetchProducts()}
            className="text-decoration-none"
          >
            <div className="card card-link card-link-pop mt-3 rounded">
              <div className="card-body d-flex align-items-center justify-content-center p-2">
                <img
                  width={50}
                  height={50}
                  className="me-2 p-2"
                  src="/images/categories.png"
                />
                <h4 className="mb-0 ">All</h4>
              </div>
            </div>
          </a>
        </div>
        <div className="col-md-10">
          <div
            className="horizontal-scroll"
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            <div className="row mt-3">
              {categories.map((category) => (
                <div className="col-4" key={category.id}>
                  <a
                    href={"#"}
                    className="text-decoration-none"
                    onClick={() => {
                      fetchProductByCategoryId(category.id);
                      setCurrentCategoryId(category.id);
                    }}
                  >
                    <div className="card card-link card-link-pop rounded">
                      <div className="card-body d-flex align-items-center justify-content-center p-2">
                        <img
                          width={50}
                          height={50}
                          className="me-2"
                          src={`${import.meta.env.VITE_APP_IMAGEBASEURL}/${category.image}`}
                        />
                        <h4>{category.name}</h4>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
