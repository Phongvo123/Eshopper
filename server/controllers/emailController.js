const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, fullName) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Xác nhận đơn hàng", // Subject line
    text: "Hello world?", // plain text body
    html: `<div>
    <p>Xin chào <b>${fullName}</b>,</p>
    <h3>Cảm ơn bạn đã đặt hàng tại ESHOPPER!</h3>
    <p>Eshopper rất vui thông báo đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.Eshopper sẽ thông báo đến bạn ngay khi hàng chuẩn bị được giao.</p>
    <a href="${process.env.CLIENT_URL}/my-order">Theo dõi đơn hàng</a>
    </div>`, // html body
  });
};

module.exports = { sendEmailCreateOrder };
