import { v } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in");
    }
    const boards = await ctx.db
      .query("board")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    return boards;
  },
});