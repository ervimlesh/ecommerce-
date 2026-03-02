import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminInvoicePreview = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };
    console.log(orderId)
    fetchOrder();
  }, [orderId]);

  const handleSendMail = async () => {
    try {
      await axios.post(`/api/v1/auth/send-invoice/${orderId}`);
      
      alert("Invoice sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send invoice.");
    }
  };

  const handleDownload = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice_${orderId}.pdf`);
  };

  if (!order) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="card shadow-sm" ref={invoiceRef}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Invoice</h3>
            <small className="text-muted">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </small>
          </div>

          <hr />

          <div className="mb-3 ">
            
             <p><strong>Order Id:</strong> {order?.payment?.razorpayOrderId}</p>
            <p><strong>Payment Id:</strong> {order?.payment?.razorpayPaymentId}</p>
            <p><strong>Buyer Name:</strong> {order?.buyer?.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Last Name:</strong> {order?.lname}</p>
            <p><strong>Number:</strong> {order.number}</p>
            <p><strong>Pincode:</strong> {order.pincode}</p>
            <p><strong>City:</strong> {order.city}</p>
            <p><strong>State:</strong> {order.state}</p>
            <p><strong>Country:</strong> {order.country}</p>

            <p><strong>Status:</strong> {order.status}</p>

          </div>

          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Price (₹)</th>
                 <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((product) => (
                <tr key={product?._id}>
                  <td>{product?.name}</td>
                  <td>{product?.description}</td>
                  <td>{product?.price}</td>
                  <td>{product?.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-warning" onClick={() => navigate(-1)}>
          Back
        </button>
        <div>
          <button className="btn btn-danger me-2" onClick={handleDownload}>
            <i className="bi bi-file-earmark-pdf"></i> Download PDFs
          </button>
          <button className="btn btn-success" onClick={handleSendMail}>
            <i className="bi bi-envelope-fill"></i> Send Mail
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoicePreview;
