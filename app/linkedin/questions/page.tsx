"use client";

import { LINKEDIN_ONBOARDING_QUESTIONS } from "@/lib/onboardingQuestions";
import { useState } from "react";


export default function LinkedInQuestionsPage() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(id: string, value: any) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);

  const res = await fetch("/api/auth/linkedin/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  setSubmitting(false);

  if (!res.ok) {
    alert("Failed to save preferences. Please try again.");
    return;
  }

  window.location.href = "/";
}


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto py-20 space-y-6"
    >
      <h1 className="text-2xl font-semibold">
        Personalize your LinkedIn content
      </h1>

      {LINKEDIN_ONBOARDING_QUESTIONS.map((q) => (
        <div key={q.id} className="space-y-2">
          <label className="block font-medium">{q.question}</label>

          {q.type === "text" && (
            <input
              className="w-full border rounded px-3 py-2"
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "select" && (
            <select
              className="w-full border rounded px-3 py-2"
              onChange={(e) => handleChange(q.id, e.target.value)}
            >
              <option value="">Select</option>
              {q.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {q.type === "multiselect" && (
            <div className="space-y-1">
              {q.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const prev = answers[q.id] || [];
                      handleChange(
                        q.id,
                        e.target.checked
                          ? [...prev, opt]
                          : prev.filter((v: string) => v !== opt)
                      );
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-primary px-6 py-2 text-white"
      >
        {submitting ? "Saving…" : "Save & Continue"}
      </button>
    </form>
  );
}
