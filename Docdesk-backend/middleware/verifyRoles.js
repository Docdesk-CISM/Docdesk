const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userData || !req.userData.roles) {
      return res.status(403).json({ message: "Forbidden: No roles found" });
    }

    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.userData.roles);

    if (!result) {
      return res.status(401).json({ message: "Unauthorized: Access denied" });
    }

    next();
  };
};

module.exports = verifyRoles;
