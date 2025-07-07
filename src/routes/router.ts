import { Schema } from "mongoose";
import { Router, Request, Response, NextFunction } from "express";
import { User, Content, Tags, ShareLink, IUser } from "../schema/Schema";
import { ContentSchemaType } from "../zod/zodSchema";
import { authMiddleware, contentZodValidation } from "../middleware/middleware";
import { generateHash } from "../utils";
const appRouter = Router();

async function findLink(userId: Schema.Types.ObjectId) {
    try {
        const link = await ShareLink.findOne({ userId: userId });
        return link;
    } catch (e) {
        return e;
    }
}
appRouter.get("/mind/:shareLink", async (req: Request, res: Response) => {
    const hash = req.params.shareLink;
    try {
        const link = await ShareLink.findOne({ hash: hash });
        if (!link) {
            console.log("link not found");
            res.send("Incorrect link");
            return;
        }
        const userId = link?.userId;
        try {
            const content = await Content.find({ userId: userId }).populate({
                path: "userId",
                model: "user",
                select: "username",
            });
            res.status(200).send(content);
        } catch (e) {
            res.status(403).send("error occured at content db call");
        }
    } catch (e) {
        res.status(403).send(e);
    }
});

appRouter.use(authMiddleware);

appRouter.post(
    "/content",
    contentZodValidation,
    async (req: Request, res: Response) => {
        const content: ContentSchemaType = req.body;
        try {
            await Content.create({
                type: content.type,
                link: content.link,
                title: content.title,
                userId: req.userId,
                tags: content.tags,
            });
            res.status(200).send("Course created");
        } catch (e) {
            res.status(403).send(e);
        }
    }
);
appRouter.get("/content", async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const content = await Content.find({ userId: userId }).populate({
            path: "userId",
            model: "user",
            select: "username",
        });
        // console.log(content);
        res.status(200).send(content);
        return;
    } catch (e: any) {
        console.log(e);
        res.status(500);
    }
});
appRouter.delete("/content/:contentId", async (req: Request, res: Response) => {
    const userId = req.userId;
    const contentId = req.params.contentId;
    console.log("delet got called ")
    try {
        await Content.deleteOne({ userId: userId, _id: contentId });
        res.status(200).send("ok");
    } catch (e) {
        res.status(403);
    }
});
appRouter.post("/mind/share", async (req: Request, res: Response) => {
    const userId = req.userId;
    const { share } = req.body;
    if (share) {
        try {
            const linkExist = await ShareLink.findOne({ userId: userId });
            if (linkExist) {
                res.send(`/share/${linkExist.hash}`);
                return;
            }else{
                const hash = generateHash(8);
                try {
                    await ShareLink.create({
                        hash: hash,
                        userId: req.userId,
                    });
                    res.status(200).send(hash);
                    return;
                } catch (e: any) {
                    res.status(403).send("Database error");
                    return;
                }

            }
        } catch (e) {res.send()}
    } else {
        try {
            await ShareLink.deleteOne({ userId: userId });
            res.status(200).send("ok");
            return;
        } catch (e: any) {
            res.send(e.error);
            return;
        }
    }
});

export default appRouter;
