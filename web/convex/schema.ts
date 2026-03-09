import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  solutions: defineTable({
    problem: v.string(), solution: v.string(), steps: v.array(v.string()),
    answer: v.string(), difficulty: v.string(), topic: v.string(), createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
