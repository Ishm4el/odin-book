import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { authenticate } from "~/services/authenticate";

import type { Route } from "./+types/comments";

export async function loader({params, request} : Route.LoaderArgs)
 {
    const user = await authenticate(request);

    const db = database();

    try {
        const comments = await db.query.comments.findMany({
            where: (t, {eq}) => eq(t.postId, params.postId),
             columns: {}
        })
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
 }