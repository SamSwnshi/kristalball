import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { connectMongo } from '../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function generateToken(user) {
	return jwt.sign({ id: String(user._id), roleName: user.roleName, baseId: user.baseId ? String(user.baseId) : null }, JWT_SECRET, { expiresIn: '12h' });
}

async function authenticate(req, res, next) {
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
		await connectMongo();
		const user = await User.findById(decoded.id)
			.populate('baseId');
			
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Set user data in request object
		req.user = {
			...decoded,
			roleName: user.role, // Add roleName for role checking
			user: {
				id: String(user._id),
				username: user.username,
				role: user.role,
				baseId: user.baseId ? String(user.baseId._id) : null
			}
		};
		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(400).json({ message: "Invalid Token!" });
	}
}

function requireRoles(roleNames) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		if (!req.user.roleName || !roleNames.includes(req.user.roleName)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
}

function scopeByBase(req, baseIdField = 'base_id') {
	// If user has a base (BaseCommander or LogisticsOfficer), enforce base_id match
	return (query) => {
		if (!req.user || !req.user.baseId) return query;
		return `${query} AND ${baseIdField} = ${req.user.baseId}`;
	};
}

export { authenticate, requireRoles, generateToken, scopeByBase };


