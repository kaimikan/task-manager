const isUnderMaintenance = true;
const maintenance = (req, res, next) => {
  if (isUnderMaintenance) {
    res.status(503).send("System is under maintenance, check back in a bit.");
  } else {
    next();
  }
};

module.exports = maintenance;
