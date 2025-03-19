const express = require('express');
const { getAllBuses, getAllRoutes, getBusDetails, getRouteDetails, getFilterRoute, getAllAds, getStopDetails } = require('../controllers/userController');

const router = express.Router();

// Bus routes
router.get('/buses', getAllBuses);
router.get('/routes', getAllRoutes);
router.get('/bus/:id', getBusDetails);
router.get('/route/:id', getRouteDetails);
router.post('/route/filter', getFilterRoute)

router.get('/ads', getAllAds);
router.get("/stop-details/:city", getStopDetails)


module.exports = router;
