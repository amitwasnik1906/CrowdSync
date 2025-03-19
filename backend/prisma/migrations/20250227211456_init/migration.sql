-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" TEXT NOT NULL,
    "bus_number" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "current_latitude" DOUBLE PRECISION,
    "current_longitude" DOUBLE PRECISION,
    "current_passenger_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "route_name" TEXT NOT NULL,
    "start_location" TEXT NOT NULL,
    "end_location" TEXT NOT NULL,
    "busId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stops" JSONB NOT NULL,
    "departure_time" TEXT NOT NULL,
    "route_polyline" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "peak_hour" TEXT NOT NULL,
    "avg_passenger_count" INTEGER NOT NULL,
    "crowd_percentage" DOUBLE PRECISION NOT NULL,
    "date_recorded" TIMESTAMP(3) NOT NULL,
    "max_passenger_count" INTEGER NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stop_name" TEXT,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_bus_number_key" ON "Bus"("bus_number");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
