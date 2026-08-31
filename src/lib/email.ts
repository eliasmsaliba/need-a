import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = `Need-A <no-reply@${process.env.RESEND_EMAIL_DOMAIN}>`;

export async function sendOtpEmail(to: string, code: string) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Your Need-A verification code: ${code}`,
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
  if (error) throw new Error(`Failed to send OTP email: ${error.message}`);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Reset your Need-A password",
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request this, ignore this email.`,
  });
  if (error) throw new Error(`Failed to send password reset email: ${error.message}`);
}

export async function sendAdminInviteEmail(to: string, inviteUrl: string) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "You've been invited to the Need-A admin console",
    text: `You've been invited to join the Need-A admin team. Set your password to get started: ${inviteUrl}\n\nThis link expires in 30 minutes.`,
  });
  if (error) throw new Error(`Failed to send admin invite email: ${error.message}`);
}
