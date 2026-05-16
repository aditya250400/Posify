import { useState, useEffect } from "react";
import "./Style.css";
import moneyFormat from "../../../utils/moneyFormat";
import Api from "../../../services/api";

const Print = () => {
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(window.location.search);
  const invoice = queryParams.get("invoice");

  const [transaction, setTransaction] = useState({});
  const [transactionDetails, setTransactionDetails] = useState([]);

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/transactions?invoice=${invoice}`);
      setTransaction(response.data.data);
      setTransactionDetails(response.data.data.transaction_details);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div className="content">
      {loading ? (
        <div className="title" style={{ paddingBottom: "13px" }}>
          <div
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontSize: "15px",
            }}
          >
            LOADING INVOICE...
          </div>
        </div>
      ) : (
        <>
          <div className="title" style={{ paddingBottom: "13px" }}>
            <div
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                fontSize: "15px",
              }}
            >
              Posify
            </div>
            <div style={{ textAlign: "center" }}>Alamat: Katapang</div>
            <div style={{ textAlign: "center" }}>Telp: 082128780623</div>
          </div>

          <div
            className="separate-line"
            style={{
              borderTop: "1px dashed #000",
              height: "1px",
              marginBottom: "5px",
            }}
          ></div>

          <table className="transaction-table" cellSpacing="0" cellPadding="0">
            <tbody>
              <tr>
                <td>TANGGAL</td>
                <td>:</td>
                <td>{transaction.created_at}</td>
              </tr>
              <tr>
                <td>FAKTUR</td>
                <td>:</td>
                <td>{transaction.invoice}</td>
              </tr>
              <tr>
                <td>KASIR</td>
                <td>:</td>
                <td>{transaction.cashier?.name ?? ""}</td>
              </tr>
              <tr>
                <td>PEMBELI</td>
                <td>:</td>
                <td>{transaction.customer?.name ?? "Umum"}</td>
              </tr>
            </tbody>
          </table>

          <div className="transaction">
            <table
              className="transaction-table"
              cellSpacing="0"
              cellPadding="0"
            >
              <tbody>
                <tr className="price-tr">
                  <td colSpan="3">
                    <div
                      className="separate-line"
                      style={{ borderTop: "1px dashed #000" }}
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>PRODUK</td>
                  <td style={{ textAlign: "center" }}>QTY</td>
                  <td style={{ textAlign: "right" }} colSpan="5">
                    HARGA
                  </td>
                </tr>
                <tr className="price-tr">
                  <td colSpan="3">
                    <div
                      className="separate-line"
                      style={{ borderTop: "1px dashed #000" }}
                    ></div>
                  </td>
                </tr>
                {transactionDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="name">{item.product.title}</td>
                    <td className="qty" style={{ textAlign: "center" }}>
                      {item.qty}
                    </td>
                    <td
                      className="final-price"
                      style={{ textAlign: "right" }}
                      colSpan="5"
                    >
                      {moneyFormat(item.price)}
                    </td>
                  </tr>
                ))}
                <tr className="price-tr">
                  <td colSpan="3">
                    <div className="separate-line"></div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="final-price">
                    SUB TOTAL
                  </td>
                  <td colSpan="3" className="final-price">
                    :
                  </td>
                  <td className="final-price">
                    {moneyFormat(transaction.grand_total)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="final-price">
                    DISKON
                  </td>
                  <td colSpan="3" className="final-price">
                    :
                  </td>
                  <td className="final-price">
                    {moneyFormat(transaction.discount)}
                  </td>
                </tr>

                <tr className="discount-tr">
                  <td colSpan="3">
                    <div className="separate-line"></div>
                  </td>
                </tr>

                <tr>
                  <td colSpan="3" className="final-price">
                    TUNAI
                  </td>
                  <td colSpan="3" className="final-price">
                    :
                  </td>
                  <td className="final-price">
                    {moneyFormat(transaction.cash)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="final-price">
                    KEMBALI
                  </td>
                  <td colSpan="3" className="final-price">
                    :
                  </td>
                  <td className="final-price">
                    {moneyFormat(transaction.change)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="thanks">=====================================</div>
          <div className="azost" style={{ marginTop: "5px" }}>
            TERIMA KASIH
            <br />
            ATAS KUNJUNGAN ANDA
          </div>
        </>
      )}
    </div>
  );
};

export default Print;
