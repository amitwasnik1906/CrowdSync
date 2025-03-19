// get all bus -- do filtering
// get all routes -- do filtering
// get bus details

const prisma = require('../prismaClient')

const getAllBuses = async (req, res) => {
    try {
        const buses = await prisma.bus.findMany();

        res.status(200).json({
            message: "Buses retrieved successfully",
            buses: buses
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve buses",
            details: error.message
        });
    }
}

const getAllRoutes = async (req, res) => {
    try {
        const routes = await prisma.route.findMany({
            include: {
                bus: true
            }
        });

        res.status(200).json({
            message: "Routes retrieved successfully",
            routes: routes
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve routes",
            details: error.message
        });
    }
}

const getBusDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const bus = await prisma.bus.findUnique({
            where: {
                id: id
            },
            include: {
                routes: true
            }
        });

        if (!bus) {
            return res.status(404).json({
                success: false,
                error: "Bus not found"
            });
        }

        res.status(200).json({
            success: true,
            bus: bus
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to get bus details",
            details: error.message
        });
    }
}

const getRouteDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const route = await prisma.route.findUnique({
            where: {
                id: id
            },
            include: {
                bus: true // Include related bus information
            }
        });
        

        if (!route) {
            return res.status(404).json({
                success: false,
                error: "Route not found"
            });
        }

        res.status(200).json({
            success: true,
            route: route
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to get route details",
            details: error.message
        });
    }
}

const getFilterRoute = async (req, res) => {
    try {
        const { startLocation, endLocation } = req.body;

        // Validate input
        if (!startLocation || !endLocation) {
            return res.status(400).json({
                error: "Start and end locations are required"
            });
        }

        // Search for routes that include the start and end locations
        var routes = await prisma.route.findMany({
            include: {
                bus: true // Include related bus information
            }
        });

        if (routes.length === 0) {
            return res.status(404).json({
                message: "No routes found for the given locations"
            });
        }

        // logic
        routes = routes.filter(route => {
            const stops = route.stops.stops;
            const startIndex = stops.findIndex(stop => stop.name === startLocation);
            const endIndex = stops.findIndex(stop => stop.name === endLocation);
            return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
        }
        );


        res.status(200).json({
            message: "Routes retrieved successfully",
            routes: routes
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to filter routes",
            details: error.message
        });
    }
}

const getAllAds = async (req, res) => {
    try {
        const ads = await prisma.ad.findMany();

        res.status(200).json({
            message: "Ads retrieved successfully",
            ads
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve ads",
            details: error.message
        });
    }
}

const getStopDetails = async (req, res) => {
    const { city } = req.params;
    
    try {
        const stops = await prisma.stop.findFirst({
            where: {
                name: {
                    contains: city,
                    mode: 'insensitive' // Case insensitive search
                }
            }
        });

        if (stops.length === 0) {
            return res.status(404).json({
                message: "No stops found for the given city"
            });
        }

        res.status(200).json({
            message: "Stop details retrieved successfully",
            stops
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve stop details",
            details: error.message
        });
    }
}

module.exports = {
    getAllBuses,
    getAllRoutes,
    getBusDetails,
    getRouteDetails,
    getFilterRoute,
    getAllAds,
    getStopDetails
}