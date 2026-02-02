import { NextRequest, NextResponse } from "next/server";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("linkedin_user_id")?.value;

  if (!userId) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  const res = await dynamoDb.send(
    new GetCommand({
      TableName: process.env.LINKEDIN_TEAM_TABLE!,
      Key: { user_id: userId },
    })
  );

  if (!res.Item) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    status: res.Item.status, // CONNECTED / READY_FOR_AUTOMATION
  });
}
