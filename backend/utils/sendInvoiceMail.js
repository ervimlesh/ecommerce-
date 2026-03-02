import transporter from "./nodemailer.js";

const sendInvoiceMail = async (order) => {
  const { buyer, products, _id, status,userEmail } = order;
  console.log("userMail",userEmail);
  

  const productDetails = products
    .map((p) => `<li>${p.name} - ₹${p.price}</li>`)
    .join("");

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Invoice for Order #${_id}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2E86C1; text-align: center;">Invoice for Order #${_id}</h2>
      
      <p><strong>Buyer:</strong> ${buyer.name}</p>
      <p><strong>Status:</strong> <span style="color: ${
        status === "Delivered" ? "green" : "orange"
      };">${status}</span></p>

      <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">Products</h3>
      <ul style="padding-left: 20px;">${productDetails}</ul>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 15px;">If you have any questions about your order, feel free to contact our support team.</p>

      <p style="text-align: center; color: #888;">Thank you for shopping with us!</p>
      <p style="text-align: center;">
        <a href="https://yourwebsite.com" style="color: #2E86C1; text-decoration: none;">Visit our website</a>
      </p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendInvoiceMail;
