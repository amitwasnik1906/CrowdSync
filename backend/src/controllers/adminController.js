// Add new Bus
// Delete Bus 
// edit Bus details

// Add new Route -- add stops in json while creating route
// Delete Route
// update Route


/* Analytics on bus Route*/

const prisma = require('../prismaClient')

const addBus = async (req, res) => {
    try {
        const { bus_number, capacity } = req.body;
        
        // Check if bus number already exists
        const existingBus = await prisma.bus.findUnique({
            where: {
                bus_number: bus_number
            }
        });

        if (existingBus) {
            return res.status(400).json({
                error: "Bus with this number already exists"
            });
        }

        // Create new bus
        const newBus = await prisma.bus.create({
            data: {
                bus_number,
                capacity,
                current_passenger_count: 0
            }
        });

        res.status(201).json({
            message: "Bus added successfully",
            bus: newBus
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to add bus",
            details: error.message
        });
    }
}

const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if bus exists
        const existingBus = await prisma.bus.findUnique({
            where: {
                id: id
            }
        });

        if (!existingBus) {
            return res.status(404).json({
                error: "Bus not found"
            });
        }

        // Delete the bus
        await prisma.bus.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({
            message: "Bus deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to delete bus",
            details: error.message
        });
    }
}

const updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const { bus_number, capacity, current_latitude, current_longitude, current_passenger_count } = req.body;

        // Check if bus exists
        const existingBus = await prisma.bus.findUnique({
            where: {
                id: id
            }
        });

        if (!existingBus) {
            return res.status(404).json({
                error: "Bus not found"
            });
        }

        // Update bus details
        const updatedBus = await prisma.bus.update({
            where: {
                id: id
            },
            data: {
                bus_number: bus_number || existingBus.bus_number,
                capacity: capacity || existingBus.capacity,
                current_latitude: current_latitude || existingBus.current_latitude,
                current_longitude: current_longitude || existingBus.current_longitude,
                current_passenger_count: current_passenger_count || existingBus.current_passenger_count,
                updated_at: new Date()
            }
        });

        res.status(200).json({
            message: "Bus updated successfully",
            bus: updatedBus
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to update bus",
            details: error.message
        });
    }
}

const addRoute = async (req, res) => {
    try {
        const { route_name, start_location, end_location, busId, stops, route_polyline, departure_time } = req.body;

        // Check if bus exists
        const bus = await prisma.bus.findUnique({
            where: {
                id: busId
            }
        });

        if (!bus) {
            return res.status(404).json({
                error: "Bus not found"
            });
        }

        // Create new route and connect to bus
        const newRoute = await prisma.route.create({
            data: {
                route_name,
                start_location,
                end_location,
                bus: {
                    connect: {
                        id: busId
                    }
                },
                stops,
                route_polyline,
                departure_time,
                status: "inactive" // Default status
            },
            include: {
                bus: true // Include bus details in response
            }
        });

        res.status(201).json({
            message: "Route created successfully",
            route: newRoute
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to create route",
            details: error.message
        });
    }
}

const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { route_name, start_location, end_location, busId, stops, route_polyline, departure_time, status } = req.body;

        // Check if route exists
        const existingRoute = await prisma.route.findUnique({
            where: {
                id: id
            }
        });

        if (!existingRoute) {
            return res.status(404).json({
                error: "Route not found"
            });
        }

        // If busId is provided, verify the bus exists
        if (busId) {
            const bus = await prisma.bus.findUnique({
                where: {
                    id: busId
                }
            });

            if (!bus) {
                return res.status(404).json({
                    error: "Bus not found"
                });
            }
        }

        // Update route
        const updatedRoute = await prisma.route.update({
            where: {
                id: id
            },
            data: {
                route_name: route_name || existingRoute.route_name,
                start_location: start_location || existingRoute.start_location,
                end_location: end_location || existingRoute.end_location,
                busId: busId || existingRoute.busId,
                stops: stops || existingRoute.stops,
                route_polyline: route_polyline || existingRoute.route_polyline,
                departure_time: departure_time ? new Date(departure_time) : existingRoute.departure_time,
                status: status || existingRoute.status
            },
            include: {
                bus: true // Include bus details in response
            }
        });

        res.status(200).json({
            message: "Route updated successfully",
            route: updatedRoute
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to update route",
            details: error.message
        });
    }
}


const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if route exists
        const existingRoute = await prisma.route.findUnique({
            where: {
                id: id
            }
        });

        if (!existingRoute) {
            return res.status(404).json({
                error: "Route not found"
            });
        }

        // Delete route
        await prisma.route.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({
            message: "Route deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to delete route",
            details: error.message
        });
    }
}

const addAd = async (req, res) => {
    try {
        const { title, description, link, image_url, stop_name } = req.body;

        // Validate input
        if (!title || !description || !stop_name) {
            return res.status(400).json({
                error: "Title, description, and stop name are required"
            });
        }

        // Create the ad
        const newAd = await prisma.ad.create({
            data: {
                title,
                description,
                link,
                image_url,
                stop_name 
            }
        });

        res.status(201).json({
            message: "Ad created successfully",
            ad: newAd
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to create ad",
            details: error.message
        });
    }
}

const addStopDetails = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({
                error: "Name is required"
            });
        }

        // Create the stop
        const newStop = await prisma.stop.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({
            message: "Stop created successfully",
            stop: newStop
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to create stop",
            details: error.message
        });
    }
}



module.exports = {
    addBus,
    deleteBus,
    updateBus,
    addRoute,
    updateRoute,
    deleteRoute,
    addAd,
    addStopDetails
}