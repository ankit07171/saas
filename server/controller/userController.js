import sql from "../config/db.js";

export const getUserCreations = async (req, res)=>{
try {
const {userId} = req.auth()
const creations = await sql `SELECT * FROM creations WHERE user_id =${userId} ORDER BY created_at DESC`;
res.json({ success: true, creations });
 } 
catch (error) {
res.json({ success: false, message: error.message });
}
} 

export const getPublishedCreations = async (req, res)=>{
try {
// const {userId} = req.auth()
const creations = await sql `SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
res.json({ success: true, creations });
 } 
catch (error) {
res.json({ success: false, message: error.message });
}
} 

 export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`
      SELECT likes FROM creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    const userIdStr = userId.toString();
    const alreadyLiked = creation.likes.includes(userIdStr);

    await sql`
      UPDATE creations
      SET likes = CASE
        WHEN ${userIdStr} = ANY(likes)
        THEN array_remove(likes, ${userIdStr})
        ELSE array_append(likes, ${userIdStr})
      END
      WHERE id = ${id}
    `;

    const message = alreadyLiked
      ? "Creation Unliked"
      : "Creation Liked";

    const creations = await sql`
      SELECT * FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    res.json({ success: true, message, creations });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
