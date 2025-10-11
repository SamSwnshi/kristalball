import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
function generateToken(user) {
	const JWT_SECRET = process.env.JWT_SECRET;
	return jwt.sign(
		{
			id: String(user._id),
			rolename: user.roleName,
			baseId: user.baseId ? String(user.baseId) : null,
		},
		JWT_SECRET,
		{ expiresIn: "12h" }
	);
}
const auth = async (req, res) => {
	try {
		const authHeader = req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Access Denied! No Token Provided" });
		}
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET);

		// Connect to database and fetch user

		const user = await User.findById(decoded.id)
			.populate("role")
			.populate("base");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		req.user = {
			...decoded,
			user: {
				id: String(user._id),
				username: user.username,
				role: user.role?.name,
				baseId: user.base ? String(user.base._id) : null,
			},
		};
		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(400).json({ message: "Invalid Token!" });
	}
};

export { generateToken, auth };
