import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/?error=missing_params", req.url)
      );
    }

    /* 🔐 Verify OAuth state */
    const storedState = req.cookies.get("linkedin_oauth_state")?.value;

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL("/?error=invalid_state", req.url)
      );
    }

    /* 1️⃣ Exchange code → access token */
    const tokenRes = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI!, // 🔴 MUST MATCH AUTH STEP
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
      }
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("LinkedIn token error:", err);
      throw new Error("Token exchange failed");
    }

    const tokenData = await tokenRes.json();

    /* 2️⃣ Fetch LinkedIn user profile */
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileRes.ok) {
      const err = await profileRes.text();
      console.error("LinkedIn profile error:", err);
      throw new Error("Profile fetch failed");
    }

    const profile = await profileRes.json();
    const userId = profile.sub;

    /* 3️⃣ Save user in DynamoDB */
    await dynamoDb.send(
      new PutCommand({
        TableName: process.env.LINKEDIN_TEAM_TABLE!,
        Item: {
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expiry: Date.now() + tokenData.expires_in * 1000,
          linkedin_profile: profile,
          status: "CONNECTED",
          connected_at: Date.now(),
        },
      })
    );

    /* 4️⃣ Redirect → onboarding */
    const response = NextResponse.redirect(
      new URL("/linkedin/questions", req.url)
    );

    response.cookies.set("linkedin_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    /* Cleanup state cookie */
    response.cookies.delete("linkedin_oauth_state");

    return response;
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", req.url)
    );
  }
}
