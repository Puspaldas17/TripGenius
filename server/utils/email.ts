import { Resend } from "resend";
import { logger } from "./logger";
import { env } from "./env";

// Initialize Resend with the API key from environment variables
// It will gracefully fall back if the key is missing
const resendApiKey = env().RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<boolean> {
  const verificationLink = `${env().NEXT_PUBLIC_APP_URL || "http://localhost:8080"}/verify?token=${token}`;

  if (!resend) {
    logger.warn(
      "email",
      `[MOCK EMAIL] RESEND_API_KEY not found. Would have sent verification email to ${email}. Link: ${verificationLink}`,
    );
    // In development without an API key, we simulate a successful send
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      // You must use a verified domain in Resend. On the free tier, you can only send to your own email from onboarding@resend.dev
      from: "TripGenius <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email to start planning with TripGenius! ✈️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
             <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TripGenius</h1>
          </div>
          <div style="padding: 32px; color: #333333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Welcome to TripGenius! We're thrilled to help you plan your next amazing journey.</p>
            <p style="font-size: 16px;">Please click the button below to verify your email address and activate your account:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationLink}" style="background-color: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 14px; color: #666666;">Or copy and paste this link into your browser: <br/> <a href="${verificationLink}" style="color: #0ea5e9;">${verificationLink}</a></p>
          </div>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">© 2026 TripGenius. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error("email", "Resend API error", error);
      return false;
    }

    logger.info("email", `Successfully sent verification email to ${email}`);
    return true;
  } catch (error) {
    logger.error("email", "Failed to send email via Resend", error);
    return false;
  }
}
