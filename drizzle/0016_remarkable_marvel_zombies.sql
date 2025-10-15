ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_userId_postId_pk";--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "id" PRIMARY KEY("userId","postId");