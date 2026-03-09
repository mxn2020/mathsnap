import { action } from "./_generated/server";
import { v } from "convex/values";
export const solveProblem = action({
    args: { imageBase64: v.optional(v.string()), textProblem: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const userContent: any[] = [{
            type: "text", text: `Solve this math problem step by step. Return JSON:
{"problem":"<problem statement>","steps":["step 1","step 2",...],"answer":"<final answer>","difficulty":"easy|medium|hard|expert","topic":"<math topic>"}` }];
        if (args.imageBase64) userContent.push({ type: "image_url", image_url: { url: args.imageBase64 } });
        else if (args.textProblem) userContent[0] = { type: "text", text: `Solve this math problem step by step: ${args.textProblem}\n\nReturn JSON:\n{"problem":"<problem>","steps":["step 1",...],"answer":"<final answer>","difficulty":"easy|medium|hard|expert","topic":"<topic>"}` };
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    { role: "system", content: "You are MathSnap, an expert math tutor. Solve problems with clear step-by-step explanations. Use LaTeX notation for formulas. Output valid JSON only." },
                    { role: "user", content: userContent },
                ], temperature: 0.2, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!response.ok) throw new Error(`OpenAI error: ${await response.text()}`);
        const data = (await response.json()) as any;
        return JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    },
});
