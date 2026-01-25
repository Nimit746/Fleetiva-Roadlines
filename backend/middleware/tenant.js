exports.scopeTenant = (req, res, next) => {
  if (!req.user || !req.user.tenantId) {
    return res.status(400).json({ message: "Tenant context missing" });
  }
  // Attach tenantId to req for scoped queries
  req.tenantId = req.user.tenantId;
  next();
};