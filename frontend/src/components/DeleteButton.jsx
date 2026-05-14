import Api from "../services/api";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useLoading } from "../states/loading";

export default function DeleteButton({ id, endpoint, fetchData }) {
  const { loading, setLoading } = useLoading();
  const confirmDelete = () => {
    confirmAlert({
      title: "Are You Sure?",
      message: "Do you want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: deleteData,
        },
        {
          label: "NO",
          onClick: () => {},
        },
      ],
    });
  };

  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await Api.delete(`${endpoint}/${id}`);
      toast.success(`${response.data.meta.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      fetchData();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-danger rounded" onClick={confirmDelete}>
      Delete
    </button>
  );
}
