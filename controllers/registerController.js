const Admin=require('../../models/AdminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin=async(req,res)=>{
    const { username, password } = req.body;

    try {
        // Check if admin already exists
        let admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }
        const salt=await bcrypt.genSalt(10);
        const securepass=await bcrypt.hash(password, salt);
        // Create new admin
        admin = new Admin({
            username,
            password: securepass

        });

        await admin.save();

        res.status(201).json({ msg: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.login=async(req,res)=>{
    const { username, password } = req.body;

    try {
        // Check if admin exists
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
