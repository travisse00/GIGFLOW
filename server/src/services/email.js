const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    from: `"GigFlow" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to GigFlow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h1 style="color: #7c3aed;">
          Welcome to GigFlow, ${user.name}!
        </h1>

        <p>
          Your account has been created successfully.
        </p>

        <p>
          You can now ${
            user.role === "freelancer"
              ? "create gigs and offer your services."
              : "browse gigs and hire freelancers."
          }
        </p>

        <p>
          Thanks for joining GigFlow.
        </p>
      </div>
    `
  });
};

module.exports = {
  sendWelcomeEmail
};