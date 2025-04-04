import express from "express";
import {
  getDeviceById,
  addDevice,
  deleteDevice,
  getDeviceHistory,
  getDeviceLocation,
  getDeviceSettings,
  getDeviceStatus,
  getDeviceType,
  getDevices,
  toggleDevice,
  updateDevice,
  updateDeviceSettings,
  getSolarPanelById,
  getSolarPanels,
} from "../controllers/smartHome";
const router = express.Router();

/**
 * @swagger
 * /smart/devices:
 *   get:
 *     summary: Retrieve a list of devices
 *     responses:
 *       200:
 *         description: A list of devices
 */
router.get("/devices", getDevices);

/**
 * @swagger
 * /smart/devices/{deviceId}:
 *   get:
 *     summary: Retrieve a device by ID
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: A single device
 */
router.get("/devices/:deviceId", getDeviceById);

/**
 * @swagger
 * /smart/devices:
 *   post:
 *     summary: Add a new device
 *     responses:
 *       201:
 *         description: Device created successfully
 */
router.post("/devices", addDevice);

/**
 * @swagger
 * /smart/devices/{deviceId}:
 *   put:
 *     summary: Update a device by ID
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device updated successfully
 */
router.put("/devices/:deviceId", updateDevice);

/**
 * @swagger
 * /smart/devices/{deviceId}:
 *   delete:
 *     summary: Delete a device by ID
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device deleted successfully
 */
router.delete("/devices/:deviceId", deleteDevice);

/**
 * @swagger
 * /smart/devices/{deviceId}/status:
 *   get:
 *     summary: Get the status of a device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device status retrieved successfully
 */
router.get("/devices/:deviceId/status", getDeviceStatus);

/**
 * @swagger
 * /smart/devices/{deviceId}/type:
 *   get:
 *     summary: Get the type of a device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device type retrieved successfully
 */
router.get("/devices/:deviceId/type", getDeviceType);

/**
 * @swagger
 * /smart/devices/{deviceId}/settings:
 *   put:
 *     summary: Update the settings of a device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device settings updated successfully
 */
router.put("/devices/:deviceId/settings", updateDeviceSettings);

/**
 * @swagger
 * /smart/devices/{deviceId}/settings:
 *   get:
 *     summary: Get the settings of a device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device settings retrieved successfully
 */
router.get("/devices/:deviceId/settings", getDeviceSettings);

/**
 * @swagger
 * /smart/devices/{deviceId}/toggle:
 *   post:
 *     summary: Toggle the state of a device
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device toggled successfully
 */
router.post("/devices/:deviceId/toggle", toggleDevice);

router.get("/devices/:deviceId/history", getDeviceHistory);
router.get("/devices/:deviceId/location", getDeviceLocation);


/**
 * @swagger
 * /smart/solar-panels:
 *   get:
 *     summary: Retrieve a list of solar panels
 *     responses:
 *       200:
 *         description: A list of solar panels
 */
router.get("/solar-panels", getSolarPanels);

/**
 * @swagger
 * /smart/solar-panels/{panelId}:
 *   get:
 *     summary: Retrieve a solar panel by ID
 *     parameters:
 *       - in: path
 *         name: panelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the solar panel
 *     responses:
 *       200:
 *         description: A single solar panel
 */
router.get("/solar-panels/:panelId", getSolarPanelById);



export default router;
