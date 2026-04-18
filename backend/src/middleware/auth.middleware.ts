import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { getDataSource } from "../lib/data-source.js";
import { User } from "../entities/user.entity.js";


export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
  // console.log("Auth userId:", userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    const clerkUser = await clerkClient.users.getUser(userId);

    // console.log("Clerk user:", clerkUser.id);
    
  
    const userRepo = (await getDataSource()).getRepository(User);
    let user = await userRepo.findOne({
      where: { clerk_id: clerkUser.id },
    });
     console.log("DB user:", user ? user : "Not found");
    
    if (!user) {
      user = userRepo.create({
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
      });

      await userRepo.save(user);

      // console.log("User CREATED in DB:", user);
    } else {
      // console.log("User already exists:", user.user_id);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};