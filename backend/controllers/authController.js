import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/createToken.js";
import { signupSchema, loginSchema } from "../utils/validation.js";
import { getDuplicateKeyField, duplicateUserMessage } from "../utils/authErrors.js";
 
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};


export const signup = async (req, res) => {
  try {
    // Zod validation layer
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ 
            message: validation.error.issues[0].message //ZodError object definitely has an .issues array
        });
    }

    const { email, password, username } = validation.data;

    // One query covers both unique constraints - email and username are
    // each checked, and the message reflects whichever one collided.
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const duplicateField = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        success: false,
        message: duplicateUserMessage(duplicateField),
      });
    }

    // Create user 
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Generate JWT
    const token = createToken(user._id);

    res.cookie("token", token, cookieOptions);

    // Send response
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    // Handles the race where two signups for the same email/username pass
    // the check above at nearly the same time - the database's unique
    // index is the real integrity guarantee; this just keeps the response
    // a clean 409 instead of a generic 500.
    const duplicateField = getDuplicateKeyField(error);
    if (duplicateField) {
      return res.status(409).json({
        success: false,
        message: duplicateUserMessage(duplicateField),
      });
    }

    console.error("Signup error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


export const login = async (req, res) => {
  try {
    // VALIDATION LAYER
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ 
            message: validation.error.errors[0].message 
        });
    }

    const { email, password } = validation.data;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = createToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({ success: true });
};
