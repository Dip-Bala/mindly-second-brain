//signup signin related middlewares
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  userZodSchema,
  UserSchemaType,
  contentZodSchema,
} from "../zod/zodSchema";
import { User, Content, Tags, ShareLink, IUser } from "../schema/Schema";
import { verifyToken } from "../jwtAuth/jwt";
//zod validation
export function userZodValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsedData = userZodSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(411).send(
      parsedData.error.issues[0].message
    ); //if there are n fields and n errors then there will be an array of errors. so we might want our user to resolve issues one by one so we show them errorr one by one
    return;
  }
  next();
}
//check whether the username is already taken
export async function usernameAvailablity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const username = req.body.username;
  const path = req.path;
  try {
    const user = (await User.findOne({ username: username })) as IUser;
    if (user) {
      if (path === "/signin") {
        req.user = user;
        next();
      } else if (path === "/signup") {
        res.status(403).send("Username already exists");
        return;
      }
    } else {
      if (path === "/signin") {
        res.status(411).send("User does not exist.");
        return;
      } else if (path === "/signup") {
        next();
      }
    }
  } catch (e: any) {
    res.send(e.error.message);
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const jwt_token: string = req.headers.authorization as string;
  const decodedData = await verifyToken(jwt_token);
  if (!decodedData || typeof decodedData === "string") {
    res.status(411).send("Invalid token");
    return;
  } else {
    req.userId = decodedData._id;
    console.log(decodedData);
    next();
  }
}

export function contentZodValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsedData = contentZodSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).send(parsedData.error.issues[0].message); //if there are n fields and n errors then there will be an array of errors. so we might want our user to resolve issues one by one so we show them errorr one by one
    return;
  }
  next();
}
