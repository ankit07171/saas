import { clerkClient } from "@clerk/express";

export const attachPlan = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);

    req.plan = user.privateMetadata?.plan || "free";
    req.free_usage = user.privateMetadata?.free_usage || 0;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
