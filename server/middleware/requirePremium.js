export const requirePremium = async (req, res, next) => {
  try {
    const auth = await req.auth();
    const isPremium = await auth.has({ plan: "premium" });

    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message: "This feature is available only for premium subscriptions.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
