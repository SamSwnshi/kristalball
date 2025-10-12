import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Optional: Warn if secret missing
if (!JWT_SECRET) {
	console.error("❌ ERROR: JWT_SECRET is not defined in your environment variables!");
	process.exit(1);
}

// ------------------- Generate Token -------------------
function generateToken(user) {
	return jwt.sign(
		{
			id: String(user._id),
			roleName: user.roleName, // ✅ Keep consistent naming
			baseId: user.baseId ? String(user.baseId) : null,
		},
		JWT_SECRET,
		{ expiresIn: "12h" }
	);
}

// ------------------- Authenticate Middleware -------------------
const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Access Denied! No Token Provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await User.findById(decoded.id)
			.populate('baseId');

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		req.user = {
			...decoded,
			roleName: user.role, 
			user: {
				id: String(user._id),
				username: user.username,
				role: user.role,
				baseId: user.baseId ? String(user.baseId._id) : null
			}
		};
			console.log("Authenticated User:", req.user);

		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(400).json({ message: "Invalid Token!" });
	}
};

// ------------------- Role-Based Access Middleware -------------------
const requireRoles = (roleNames) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		// ✅ Use consistent naming
		const userRole = req.user.roleName;

		if (!userRole || !roleNames.includes(userRole)) {
			return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
		}

		next();
	};
};

export { generateToken, authenticate, requireRoles };
