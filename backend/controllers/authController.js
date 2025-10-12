import bcrypt from 'bcryptjs';
import { connectMongo } from '../lib/db.js';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { Base } from '../models/Base.js';
import { generateToken } from '../middleware/auth.js';

export const authController = {
	async login(req, res) {
		try {
			const { username, password } = req.body || {};
			if (!username || !password) {
				return res.status(400).json({ error: 'username and password required' });
			}

			await connectMongo();
			const user = await User.findOne({ username })
				.populate('baseId');

			if (!user) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			const ok = await bcrypt.compare(password, user.password);
			if (!ok) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			const token = generateToken({ 
				_id: user._id, 
				roleName: user.role, 
				baseId: user.baseId?._id 
			});

			return res.json({ 
				token, 
				user: { 
					id: String(user._id), 
					username: user.username, 
					role: user.role, 
					baseId: user.baseId ? String(user.baseId._id) : null 
				} 
			});
		} catch (error) {
			console.error('Login error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async signup(req, res) {
		try {
			const { username, password, role, baseId } = req.body || {};
			
			if (!username || !password || !role) {
				return res.status(400).json({ 
					error: 'username, password, and role are required' 
				});
			}

			// Validate role
			const validRoles = ['admin', 'baseCommander', 'logisticsOfficer'];
			if (!validRoles.includes(role)) {
				return res.status(400).json({ 
					error: 'Invalid role. Must be one of: admin, baseCommander, logisticsOfficer' 
				});
			}

			await connectMongo();

			// Check if username already exists
			const existingUser = await User.findOne({ username });
			if (existingUser) {
				return res.status(409).json({ error: 'Username already exists' });
			}

			// Verify base exists if provided
			let base = null;
			if (baseId) {
				base = await Base.findById(baseId);
				if (!base) {
					return res.status(400).json({ error: 'Invalid base ID' });
				}
			}

			// Hash password
			const saltRounds = 12;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			// Create user
			const user = new User({
				username,
				password: hashedPassword,
				role,
				baseId: baseId || undefined
			});

			await user.save();
			if (baseId) {
				await user.populate('baseId');
			}

			// Generate token
			const token = generateToken({ 
				_id: user._id, 
				roleName: user.role, 
				baseId: user.baseId?._id 
			});

			return res.status(201).json({ 
				token, 
				user: { 
					id: String(user._id), 
					username: user.username, 
					role: user.role, 
					baseId: user.baseId ? String(user.baseId._id) : null 
				} 
			});
		} catch (error) {
			console.error('Signup error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async logout(req, res) {
		try {
			// For JWT tokens, logout is typically handled client-side by removing the token
			// If you want server-side token invalidation, you'd need a token blacklist
			// For now, we'll just return a success response
			return res.json({ message: 'Logged out successfully' });
		} catch (error) {
			console.error('Logout error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async setupBases(req, res) {
		try {
			await connectMongo();

			// Clear existing bases
			await Base.deleteMany({});

			// Create bases
			const bases = await Base.insertMany([
				{ name: 'Alpha Base' },
				{ name: 'Bravo Base' },
				{ name: 'Charlie Base' }
			]);

			return res.status(201).json({
				message: 'Bases created successfully',
				bases: bases.map(b => ({ id: b._id, name: b.name }))
			});
		} catch (error) {
			console.error('Setup bases error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};
