import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveSolution = mutation({
  args: { problem: v.string(), solution: v.string(), steps: v.array(v.string()), answer: v.string(), difficulty: v.string(), topic: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("solutions", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("solutions").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
