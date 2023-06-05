import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { isTemporaryEmail } from "temporary-email-validator";
import { signJwtAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  // Data validation
  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is not valid",
    },
    {
      valid: isTemporaryEmail(email) === false,
      errorMessage: "Do not use a temporary email address",
    },
  ];

  let hasError = false;
  let errorMessage = "";
  for (let check of validationSchema) {
    if (check.valid === false) {
      hasError = true;
      errorMessage = check.errorMessage;
      break;
    }
  }
  if (hasError) {
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User with this email does not exists" }, { status: 400 });
  }

  const { password, ...userWithoutPassword } = user;

  const accessToken = signJwtAccessToken(userWithoutPassword, { expiresIn: "15m" });

  // NODEMAILER PART
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.ETHEREAL_EMAIL}`, // generated ethereal user
      pass: `${process.env.ETHEREAL_PASSWORD}`, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Assignment Nordstone" <${process.env.ETHEREAL_EMAIL}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Reset your password", // Subject line
    text: `
      Dear ${email.split("@")[0]},
      We recently received a request to reset the password associated with your Nordstone account. To regain access to your account, please follow the instructions below:
      1. Click on the password reset link at Reset Password
      2. Follow the on-screen instructions to create a new password for your account.
      Please note that this password reset link will expire after 24 hours for security reasons. If you don't reset your password within this time frame, you'll need to submit another "Forgot Password" request.
      If you did not request a password reset or believe this email was sent to you in error, please ignore it. Your account will remain secure.
      If you continue to experience any issues or have further questions, please feel free to contact our support team. We're here to help!
      Thank you for using our service.

      Best regards,

      Nordstone
    `, // plain text body
    html: `
    <body>
        <h2>Reset Your Password</h2>
        <p>Dear ${email.split("@")[0]},</p>
        <p>We recently received a request to reset the password associated with your Nordstone account. To regain access to your account, please follow the instructions below:</p>
        <ol>
            <li>Click on the password reset link at <a href="https://nordstone-assignment.vercel.app/forgot_password?token=${accessToken}">Reset Password Vercel</a></li>
            <li>or <a href="http://localhost:3000/forgot_password?token=${accessToken}">Reset Password Localhost</a></li>
            <li>Follow the on-screen instructions to create a new password for your account.</li>
        </ol>
        <p>Please note that this password reset link will expire after 24 hours for security reasons. If you don't reset your password within this time frame, you'll need to submit another "Forgot Password" request.</p>
        <p>If you did not request a password reset or believe this email was sent to you in error, please ignore it. Your account will remain secure.</p>
        <p>If you continue to experience any issues or have further questions, please feel free to contact our support team. We're here to help!</p>
        <p>Thank you for using our service.</p>
        <p>Best regards,</p>
        <p>Nordstone</p>
    </body>
    `,
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return NextResponse.json(
    { info: info, error: "SUCCESS: Check your email for link to reset password" },
    { status: 400 }
  );
}
