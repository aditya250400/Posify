import LayoutAuth from "../../layouts/auth";

export default function Login() {
  return (
    <LayoutAuth>
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="constainer-fluid py-5">
          <h4 className="display-6 fw-bold text-center">Login Page</h4>
        </div>
      </div>
    </LayoutAuth>
  );
}
