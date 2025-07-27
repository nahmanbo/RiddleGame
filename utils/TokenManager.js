import fs from "fs";

// Utility to manage token persistence
export const TokenManager = {
  save(token) {
    fs.writeFileSync(".token", token);
  },
  load() {
    try {
      return fs.readFileSync(".token", "utf8").trim();
    } catch {
      return null;
    }
  },
  delete() {
    try {
      fs.unlinkSync(".token");
      console.log("Logged out successfully.");
    } catch {
      console.warn("No token to delete. Already logged out?");
    }
  }
};
