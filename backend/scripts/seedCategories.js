import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import User from "../models/User.js";

dotenv.config();

const defaultCategories = {
  expense: [
    { name: "Food & Dining", color: "#ef4444", icon: "utensils" },
    { name: "Rent & Housing", color: "#f97316", icon: "home" },
    { name: "Transport", color: "#eab308", icon: "car" },
    { name: "Shopping", color: "#22c55e", icon: "shopping-bag" },
    { name: "Bills & Utilities", color: "#14b8a6", icon: "file-text" },
    { name: "Health & Medical", color: "#06b6d4", icon: "heart" },
    { name: "Entertainment", color: "#8b5cf6", icon: "film" },
    { name: "Education", color: "#ec4899", icon: "book" },
    { name: "Personal Care", color: "#f43f5e", icon: "user" },
    { name: "Other Expense", color: "#6b7280", icon: "more-horizontal" },
  ],
  income: [
    { name: "Salary", color: "#10b981", icon: "briefcase" },
    { name: "Freelance", color: "#3b82f6", icon: "laptop" },
    { name: "Business", color: "#6366f1", icon: "trending-up" },
    { name: "Investments", color: "#8b5cf6", icon: "bar-chart" },
    { name: "Gifts", color: "#ec4899", icon: "gift" },
    { name: "Other Income", color: "#6b7280", icon: "plus-circle" },
  ],
};

const seedCategoriesForUser = async (userId) => {
  try {
    const existingCategories = await Category.find({
      createdBy: userId,
      isDefault: true,
    });

    if (existingCategories.length > 0) {
      console.log(`User ${userId} already has default categories.`);
      return;
    }

    const categoriesToCreate = [];

    for (const [type, categories] of Object.entries(defaultCategories)) {
      for (const cat of categories) {
        categoriesToCreate.push({
          name: cat.name,
          type,
          color: cat.color,
          icon: cat.icon,
          isDefault: true,
          createdBy: userId,
        });
      }
    }

    await Category.insertMany(categoriesToCreate);
    console.log(
      `Created ${categoriesToCreate.length} default categories for user ${userId}`
    );
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};

// Main execution - only run when called directly
const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({});

    if (users.length === 0) {
      console.log("No users found. Please register a user first.");
      process.exit(0);
    }

    for (const user of users) {
      await seedCategoriesForUser(user._id);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

// Only run main() if this file is executed directly (not imported)
if (process.argv[1]?.includes("seedCategories")) {
  main();
}

export { seedCategoriesForUser, defaultCategories };
