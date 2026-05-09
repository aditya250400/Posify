import LayoutAuth from "../../layouts/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../states/user";
import { useLoading } from "../../states/loading";
import { handleErrors } from "../../utils/handleErrors";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const { loading, setLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginFailed, setLoginFailed] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      onResetHandler();
      return navigate("/dashboard");
    } catch (e) {
      if (e.response.data.message) {
        setLoginFailed(e.response.data.message);
        return;
      }

      handleErrors(e.response.data, setErrors);
    } finally {
      setLoading(false);
    }
  };

  const onResetHandler = () => {
    setEmail("");
    setPassword("");
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "email") {
      setEmail(value);
      setErrors({ ...errors, email: "" });
      setLoginFailed("");
    } else {
      setPassword(value);
      setErrors({ ...errors, password: "" });
      setLoginFailed("");
    }
  };

  useEffect(() => {
    setLoading(false);

    return () => {
      setLoading(true);
    };
  }, []);
  return (
    <LayoutAuth>
      <div className="text-center mb-4 mt-5">
        <a
          href="/"
          className="navbar-brand navbar-brand-autodark p-4 bg-blue-lt rounded-circle shadow-sm"
        >
          <img src="/images/logo.png" height="60" alt="" />
        </a>
        <br />
        <h2 className="mt-3">Posify</h2>
      </div>
      <div className="card card-md rounded">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">Login to your account</h2>
          {loginFailed && (
            <div className="alert alert-danger mt-2">{loginFailed}</div>
          )}
          <form onSubmit={loginHandler} autoComplete="off" noValidate>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={onInputChange}
                placeholder="your@email.com"
                autoComplete="off"
              />
              {errors.email && (
                <div className="alert alert-danger mt-2">{errors.email}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onInputChange}
                placeholder="Your password"
                autoComplete="off"
              />
              {errors.password && (
                <div className="alert alert-danger mt-2">{errors.password}</div>
              )}
            </div>

            <div className="form-footer">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary w-100 rounded"
              >
                {loading ? (
                  <div
                    className="spinner-border text-white"
                    role="status"
                  ></div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
