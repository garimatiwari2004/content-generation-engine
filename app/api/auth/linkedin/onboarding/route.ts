import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get authenticated user
    const user_id = req.cookies.get("linkedin_user_id")?.value;

    if (!user_id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Read request body
    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid onboarding data" },
        { status: 400 }
      );
    }

    // 3️⃣ Save onboarding answers to DynamoDB
    await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.LINKEDIN_TEAM_TABLE!,
        Key: { user_id },
        UpdateExpression: `
          SET onboarding_answers = :answers,
              onboarding_version = :version,
              #status = :status,
              updated_at = :updated_at
        `,
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":answers": answers,
          ":version": "v1",
          ":status": "READY_FOR_AUTOMATION",
          ":updated_at": Date.now(),
        },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding save failed:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
