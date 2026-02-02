import { NextRequest, NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  // 1️⃣ Simple auth (required even locally)
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.N8N_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ Fetch users ready for automation
  const res = await dynamoDb.send(
    new ScanCommand({
      TableName: process.env.LINKEDIN_TEAM_TABLE!,
      FilterExpression: "#status = :s",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":s": "READY_FOR_AUTOMATION",
      },
    })
  );

  return NextResponse.json({
    users: res.Items ?? [],
  });
}
