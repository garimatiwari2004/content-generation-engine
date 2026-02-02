import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    if (
      !process.env.LINKEDIN_CLIENT_ID ||
      !process.env.LINKEDIN_REDIRECT_URI
    ) {
      throw new Error("Missing LinkedIn env vars");
    }

    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      scope: "openid profile email w_member_social",
      state,
    });

    const redirectUrl =
      "https://www.linkedin.com/oauth/v2/authorization?" +
      params.toString();

    // ✅ SET COOKIE USING RESPONSE
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("linkedin_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60, // 10 minutes
    });

    return response;
  } catch (err) {
    console.error("LinkedIn auth init failed:", err);
    return new NextResponse("OAuth init failed", { status: 500 });
  }
}
