const express = require('express');
const { updateLocation, updatePeopleCount } = require('../controllers/busController');

const router = express.Router();

// Bus location and passenger count updates
router.put("/update/location", updateLocation)
router.put("/update/count", updatePeopleCount)


module.exports = router;
