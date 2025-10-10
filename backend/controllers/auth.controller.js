import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import Base from "../models/base.models.js";
import Role from "../models/role.models.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "username and password required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const hashedPassword = await bcrypt.compare(password, user.password);
        if (!hashedPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken({
            _id: user._id,
            rolename: user.role?.name,
            baseId: user.base?._id,
        });
        return res.json({
            token,
            user: {
                id: String(user._id),
                username: user.username,
                role: user.role?.name,
                baseId: user.base ? String(user.base._id) : null,
            },
        });
    } catch (error) { 
        console.error('Login error:', error);
			return res.status(500).json({ error: 'Internal server error' });
    }
};
export const signUp = async (req, res) => {
    try {
        const { username, password, roleId, baseId } = req.body || {};
			
			if (!username || !password || !roleId) {
				return res.status(400).json({ 
					error: 'username, password, and roleId are required' 
				});
			}

            const existingUser = await User.findOne({ username });
			if (existingUser) {
				return res.status(409).json({ error: 'Username already exists' });
			}
            const role = await Role.findById(roleId);
			if (!role) {
				return res.status(400).json({ error: 'Invalid role ID' });
			}
            let base = null;
			if (baseId) {
				base = await Base.findById(baseId);
				if (!base) {
					return res.status(400).json({ error: 'Invalid base ID' });
				}
			}

			const saltRounds = 12;
			const passwordHash = await bcrypt.hash(password, saltRounds);


			const user = new User({
				username,
				passwordHash,
				role: roleId,
				base: baseId || undefined
			});

			await user.save();
			await user.populate('role');
			if (baseId) {
				await user.populate('base');
			}

			// Generate token
			const token = generateToken({ 
				_id: user._id, 
				roleName: user.role?.name, 
				baseId: user.base?._id 
			});

			return res.status(201).json({ 
				token, 
				user: { 
					id: String(user._id), 
					username: user.username, 
					role: user.role?.name, 
					baseId: user.base ? String(user.base._id) : null 
				} 
			});
    } catch (error) {
        console.error('Signup error:', error);
			return res.status(500).json({ error: 'Internal server error' });
     }
};
export const logout = async (req, res) => {
    try {
        return res.json({ message: 'Logged out successfully' });
    } catch (error) { 
        console.error('Logout error:', error);
			return res.status(500).json({ error: 'Internal server error' });
    }
};
