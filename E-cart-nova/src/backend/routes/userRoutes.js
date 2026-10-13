import User from "../models/User.js";

// =====================================================
// REMOVE PASSWORD FROM RESPONSE
// =====================================================

const clean = (user) => {
  if (!user) return null;

  const obj = user.toObject();

  delete obj.password;

  return obj;
};


// =====================================================
// REGISTER CUSTOMER
// =====================================================

export const registerUser = async (data) => {
  try {
    if (!data.name || !data.email || !data.password) {
      return {
        error: "Name, email and password are required",
      };
    }

    const existingUser = await User.findOne({
      email: data.email,
    });

    if (existingUser) {
      return {
        error: "Email already registered",
      };
    }

    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      role: "customer",
    });

    await user.save();

    return {
      user: clean(user),
    };

  } catch (error) {
    console.log("Register Error:", error);

    return {
      error: "Registration failed",
    };
  }
};


// =====================================================
// CUSTOMER LOGIN
// =====================================================

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({
      email,
      password,
      role: "customer",
    });

    return clean(user);

  } catch (error) {
    console.log("Customer Login Error:", error);

    return null;
  }
};


// =====================================================
// ADMIN LOGIN
// =====================================================

export const loginAdmin = async (email, password) => {
  try {
    const user = await User.findOne({
      email,
      password,
      role: "admin",
    });

    return clean(user);

  } catch (error) {
    console.log("Admin Login Error:", error);

    return null;
  }
};


// =====================================================
// CREATE / UPDATE ADMINS
// =====================================================

export const seedAdmin = async () => {
  try {

    // =========================
    // ADMIN 1
    // =========================

    let admin1 = await User.findOne({
      email: "admin@ecart.com",
    });

    if (!admin1) {

      await User.create({
        name: "Admin",
        email: "admin@ecart.com",
        password: "admin123",
        role: "admin",
      });

      console.log("Admin 1 created successfully");

    } else {

      admin1.name = "Admin";
      admin1.password = "admin123";
      admin1.role = "admin";

      await admin1.save();

      
    }


    // =========================
    // ADMIN 2
    // =========================

    let admin2 = await User.findOne({
      email: "dadu@gmail.com",
    });

    if (!admin2) {

      await User.create({
        name: "Admin 2",
        email: "dadu@gmail.com",
        password: "jay123",
        role: "admin",
      });

      console.log("Admin 2 created successfully");

    } else {

      admin2.name = "Admin 2";
      admin2.password = "jay123";
      admin2.role = "admin";

      await admin2.save();

     
    }

  } catch (error) {

    console.log("Seed Admin Error:", error);

  }
};