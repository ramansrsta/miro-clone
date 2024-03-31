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

export const remove = mutation({
  args: {
    id: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in");
    }
    const userId = identity.subject;
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("board"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in");
    }

    const title = args.title.trim();
    if (!title) throw new Error("Title cannot be empty");

    if (title.length > 60)
      throw new Error("Title cannot be longer than 60 characters");

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: {
    orgId: v.string(),
    id: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in");
    }

    const board = await ctx.db.get(args.id);

    if (!board) throw new Error("Board does not exist");

    const userId = identity.subject;

    const existingFavorites = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorites) throw new Error("Already favorited");

    await ctx.db.insert("userFavorites", {
      userId: userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: {
    id: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not logged in");
    }

    const board = await ctx.db.get(args.id);

    if (!board) throw new Error("Board does not exist");

    const userId = identity.subject;

    const existingFavorites = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorites) throw new Error("Favorite does not exist");

    await ctx.db.delete(existingFavorites._id);

    return board;
  },
});
