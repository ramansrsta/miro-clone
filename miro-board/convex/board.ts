import { mutation } from "./_generated/server";

import { v } from "convex/values";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not logged in");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("board", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.email!,
      imgUrl: randomImage,
    });

    return board;
  },
});