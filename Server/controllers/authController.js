const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, specialization, qualifications } =
    req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({
      name,
      email,
      passwordHash: password,
      role,
      specialization,
      qualifications,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res
      .status(201)
      .json({ token, user: { id: newUser._id, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
