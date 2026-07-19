const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const generateToken = require("../utils/generateToken");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");



const registerUser = async (req, res) => {
  try {
    // Validate Request Body
    const validationResult = registerSchema.safeParse(req.body);

    //400 Bad Request
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.issues[0].message,
      });
    }

    const { fullName, email, password } = validationResult.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If existingUser is NOT null, it means the email is already taken!
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password - hashes (encrypts) a plain-text password
    // 10 (Salt Rounds): This is the cost factor. It tells bcrypt how many times to run the hashing algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        wallet: {
          create: {},
        },
      },
    });

    // Generate JWT
    const token = generateToken(user.id);

    // Response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//login 

const loginUser = async (req, res) => {
  try {
    // Validate Request Body
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.issues[0].message,
      });
    }

    const { email, password } = validationResult.data;

    // Find User
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// Get Logged-in User
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};