"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAction(formData: FormData) {
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const name = formData.get("name") || "Anonymous";
  const email = formData.get("email") as string;

  try {
    const { data, error } = await resend.emails.send({
      from: "Mkule Contact <onboarding@resend.dev>",
      to: ["jdsablay@up.edu.ph"], // Your personal email
    //   bcc: ["mkule.upm@up.edu.ph"], // The official email
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-top: 4px solid #770000;">
          <h2 style="color: #770000;">New Inquiry: ${subject}</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
            ${message}
          </div>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Connection failed" };
  }
}