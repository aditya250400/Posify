/* eslint-disable react/prop-types */
import { useState } from "react";
import Api from "../services/api";

const ExportButton = ({ startDate, endDate, type }) => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Fetch data from API with Axios
      const response = await Api.get(
        `/${type}/export?start_date=${startDate}&end_date=${endDate}`,
        {
          responseType: "blob",
        },
      );

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `report-${type}-${startDate}-${endDate}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className="btn btn-success btn-md border-0 shadow me-3"
      disabled={!startDate || !endDate || loading}
    >
      {loading ? (
        <div className="spinner-border text-white" role="status"></div>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-file-excel"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
            <path d="M10 12l4 5" />
            <path d="M10 17l4 -5" />
          </svg>
          EXCEL
        </>
      )}
    </button>
  );
};

export default ExportButton;
