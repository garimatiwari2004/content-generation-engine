import { NextRequest, NextResponse } from "next/server";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  try {
    /* --------------------------------------------------
       1️⃣ Auth
    -------------------------------------------------- */
    const userId = req.cookies.get("linkedin_user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* --------------------------------------------------
       2️⃣ Fetch user from DynamoDB
    -------------------------------------------------- */
    const userRes = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.LINKEDIN_TEAM_TABLE!,
        Key: { user_id: userId },
      })
    );

    const user = userRes.Item;
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* --------------------------------------------------
       3️⃣ Build Gemini prompt
    -------------------------------------------------- */
    const prompt = `
You are an onboarding AI for HirezApp.

User LinkedIn info:
Name: ${user.linkedin_profile?.name || "Unknown"}
Headline: ${user.linkedin_profile?.headline || "Unknown"}

Task:
Generate 15 onboarding questions to personalize LinkedIn post automation.
Since these questions will be used for hirezapp employees to create LinkedIn posts on behalf of their users, ensure the questions help gather relevant information for generating engaging LinkedIn content.


Rules:
- Keep questions short and clear
- Questions must help generate LinkedIn posts
- Mix text and select questions
- You must also include the multi select questions as well
- Provide options for select and multi select questions
- Also try to cover genz and millennial audience preferences

- Tone: professional, friendly
- Do NOT include explanations
- Return ONLY valid JSON

JSON format:
[
  {
    "id": "q1",
    "question": "Question text",
    "type": "text"
  },
  {
    "id": "q2",
    "question": "Question text",
    "type": "select",
    "options": ["Option A", "Option B"]
  }
]
`;

    /* --------------------------------------------------
       4️⃣ Call Gemini
    -------------------------------------------------- */
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );
if (!geminiRes.ok) {
  const errText = await geminiRes.text();
  console.error("Gemini status:", geminiRes.status);
  console.error("Gemini error body:", errText);

  return NextResponse.json(
    {
      error: "Gemini API failed",
      status: geminiRes.status,
      details: errText,
    },
    { status: 500 }
  );
}


    const geminiData = await geminiRes.json();

    /* --------------------------------------------------
       5️⃣ Extract + clean Gemini output
    -------------------------------------------------- */
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Empty Gemini response:", geminiData);
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    // Remove markdown fences if Gemini adds them
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini JSON parse failed:", cleaned);
      return NextResponse.json(
        { error: "Invalid AI JSON" },
        { status: 500 }
      );
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "AI response is not an array" },
        { status: 500 }
      );
    }

    /* --------------------------------------------------
       6️⃣ Store questions in DynamoDB
    -------------------------------------------------- */
    await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.LINKEDIN_TEAM_TABLE!,
        Key: { user_id: userId },
        UpdateExpression: "SET ai_questions = :q",
        ExpressionAttributeValues: {
          ":q": questions,
        },
      })
    );

    /* --------------------------------------------------
       7️⃣ Return questions
    -------------------------------------------------- */
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("LinkedIn questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
