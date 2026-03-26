// src/utils/permissions.js

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const hasAccess = (moduleName) => {
  const user = getUser();

  if (!user) return false;

  const modules = user.modules || [];

  // Super Admin
  if (modules.includes("all")) return true;

  return modules.includes(moduleName);
};