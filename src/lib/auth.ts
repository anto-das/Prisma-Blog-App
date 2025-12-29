import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp:true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <prismablogapp@gmail.com>',
          to: "antodasahir@gmail.com",
          subject: "Email Verification",
          text: "Hello world?",
          html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Email Verification</title>
    <style>
      body {
        margin:0; padding:0; background:#eef2f7;
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color:#333;
      }
      .container { max-width:640px; margin:0 auto; padding:24px; }
      .card {
        background:#ffffff; border-radius:20px; overflow:hidden;
        box-shadow:0 6px 24px rgba(0,0,0,0.1);
      }
      .header {
        background:linear-gradient(135deg,#2563eb,#9333ea);
        color:#fff; padding:36px; text-align:center;
      }
      .header h1 { margin:0; font-size:26px; font-weight:700; }
      .body { padding:36px; }
      .title { font-size:20px; margin:0 0 12px; font-weight:600; }
      .text { margin:0 0 20px; line-height:1.6; font-size:15px; }
      .btn {
        display:inline-block; text-decoration:none;
        background:#2563eb; color:#fff !important;
        padding:14px 32px; border-radius:10px; font-weight:600;
        box-shadow:0 4px 10px rgba(37,99,235,0.4);
        transition:background 0.3s ease;
      }
      .btn:hover { background:#1e40af; }
      .link-box {
        background:#f9fafb; border:1px solid #e5e7eb;
        border-radius:8px; padding:12px; word-break:break-all;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size:13px; color:#111827;
      }
      .footer {
        color:#6b7280; font-size:12px; padding:20px 36px 36px;
        text-align:center;
      }
      .logo { font-weight:700; letter-spacing:0.3px; font-size:16px; }
      @media (prefers-color-scheme: dark) {
        body { background:#0f172a; color:#e2e8f0; }
        .card { background:#1e293b; border:1px solid #334155; }
        .header { background:linear-gradient(135deg,#4f46e5,#9333ea); }
        .text { color:#cbd5e1; }
        .footer { color:#94a3b8; }
        .link-box { background:#0f172a; border-color:#1e293b; color:#e2e8f0; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">Prisma Blog App</div>
          <h1>Email Verification</h1>
        </div>
        <div class="body">
          <h2 class="title">Welcome!</h2>
          <p class="text">
            Thanks for joining Prisma Blog App. Please verify your email address to activate your account.
          </p>
          <p style="text-align:center; margin:28px 0;">
            <!-- Verify button with link -->
            <a class="btn" href="${verificationUrl}" target="_blank" rel="noopener">
              Verify Email
            </a>
          </p>
          <p class="text">
            If the button above doesn’t work, copy and paste the following link into your browser:
          </p>
          <div class="link-box">
            ${verificationUrl}
          </div>
          <p class="text" style="margin-top:20px;">
            For security reasons, this link will expire soon. If it does, request a new verification email.
          </p>
        </div>
        <div class="footer">
          <p style="margin:0;">If you didn’t create this account, you can safely ignore this email.</p>
          <p style="margin:8px 0 0;">© {{year}} Prisma Blog App</p>
        </div>
      </div>
    </div>
  </body>
</html>
`,
        });
        console.log("message sent", info.messageId);
      } catch (error: any) {
        console.log(error);
        throw(error);
        
      }
    },
  },
});
