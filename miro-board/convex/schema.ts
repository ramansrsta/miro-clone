import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  board: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imgUrl: v.string(),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  userFavorites: defineTable({
    userId: v.string(),
    orgId: v.string(),
    boardId: v.id("board"),
  })
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_board", ["boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
