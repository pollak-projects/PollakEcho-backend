//Endpoint, Get devices, Get device by id, Add device, Update device,
// Delete device, Toggle device, Get device status, Get device history,
// Get device settings, Update device settings, Get device type, Get device location,
//  Get device manufacturer, Get device model, Get device firmware version,
// Get device software version, Get device battery level, Get device signal strength,
//  Get device connectivity status, Get device last seen time, Get device created time,
//  Get device updated time, Get device owner id, Get device group id

//All the devices are not real only for testing purposes, the endpoints should generate random data
// for the devices and return them in the response. The endpoints should also be able to handle errors and return appropriate error messages.

//Device names and location should be randomly generated. Theme School

import { Request, Response } from "express";

const nameDictionary = [
  "Smart Light",
  "Smart Thermostat",
  "Smart Lock",
  "Smart Camera",
  "Smart Speaker",
  "Smart Plug",
  "Smart Sensor",
  "Smart Switch",
  "Smart Hub",
  "Smart Display",
];
const locationDictionary = [
  "Info VI.",
  "Info VII.",
  "Info IV.",
  "Info III.",
  "Info II.",
  "Info I.",
  "Aula",
  "Földszinti folyosó",
  "Matek 2",
  "Matek 3",
  "Kajtor",
];

const deviceTypes = [
  "Light",
  "Thermostat",
  "Lock",
  "Camera",
  "Speaker",
  "Plug",
  "Sensor",
  "Switch",
  "Hub",
  "Display",
];

const deviceStatuses = ["Online", "Offline", "Idle", "Active", "Error"];

const deviceManufacturers = [
  "Philips",
  "Nest",
  "August",
  "Ring",
  "Sonos",
  "TP-Link",
  "Samsung",
  "Amazon",
  "Google",
  "Apple",
];

const deviceModels = [
  "Hue",
  "Learning Thermostat",
  "Smart Lock Pro",
  "Spotlight Cam",
  "Echo Dot",
  "Kasa Smart Plug",
  "SmartThings Hub",
  "Nest Hub",
  "HomePod Mini",
  "SmartThings Wifi",
];

const generateRandomDevice = () => {
  const name =
    nameDictionary[Math.floor(Math.random() * nameDictionary.length)];
  const location =
    locationDictionary[Math.floor(Math.random() * locationDictionary.length)];
  const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
  const status =
    deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)];
  const manufacturer =
    deviceManufacturers[Math.floor(Math.random() * deviceManufacturers.length)];
  const model = deviceModels[Math.floor(Math.random() * deviceModels.length)];

  return {
    id: Math.floor(Math.random() * 1000000),
    name,
    location,
    type,
    status,
    manufacturer,
    model,
    firmwareVersion: "1.0.0",
    softwareVersion: "1.0.0",
    batteryLevel: Math.floor(Math.random() * 100),
    signalStrength: Math.floor(Math.random() * 100),
    connectivityStatus: status === "Online" ? "Connected" : "Disconnected",
    lastSeenTime: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
    createdTime: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
    updatedTime: new Date(Date.now()).toISOString(),
    ownerId: Math.floor(Math.random() * 1000000),
    groupId: Math.floor(Math.random() * 1000000),
  };
};
let storedDevices: any[] = [];

// Initialize devices if empty
const initializeDevices = () => {
  if (storedDevices.length === 0) {
    storedDevices = generateRandomDevices(10);
  }
  return storedDevices;
};

const generateRandomDevices = (count: number) => {
  const devices = [];
  for (let i = 0; i < count; i++) {
    devices.push(generateRandomDevice());
  }
  return devices;
};

export const getDevices = (req: Request, res: Response) => {
  try {
    const devices = initializeDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDeviceById = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const device = devices.find((device) => device.id === deviceId);
    if (!device) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addDevice = (req: Request, res: Response) => {
  try {
    const { name, location, type, status, manufacturer, model } = req.body;
    if (!name || !location || !type || !status || !manufacturer || !model) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const devices = initializeDevices();
    const newDevice = {
      id: Math.floor(Math.random() * 1000000),
      name,
      location,
      type,
      status,
      manufacturer,
      model,
      firmwareVersion: "1.0.0",
      softwareVersion: "1.0.0",
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      connectivityStatus: status === "Online" ? "Connected" : "Disconnected",
      lastSeenTime: new Date(Date.now()).toISOString(),
      createdTime: new Date(Date.now()).toISOString(),
      updatedTime: new Date(Date.now()).toISOString(),
      ownerId: Math.floor(Math.random() * 1000000),
      groupId: Math.floor(Math.random() * 1000000),
    };
    devices.push(newDevice);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDevice = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const { name, location, type, status, manufacturer, model } = req.body;
    if (!name || !location || !type || !status || !manufacturer || !model) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    const updatedDevice = {
      ...devices[deviceIndex],
      name,
      location,
      type,
      status,
      manufacturer,
      model,
      updatedTime: new Date(Date.now()).toISOString(),
    };
    devices[deviceIndex] = updatedDevice;
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDevice = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    devices.splice(deviceIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const toggleDevice = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    const updatedDevice = {
      ...devices[deviceIndex],
      status: devices[deviceIndex].status === "Online" ? "Offline" : "Online",
      updatedTime: new Date(Date.now()).toISOString(),
    };
    devices[deviceIndex] = updatedDevice;
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update all the remaining functions to use initializeDevices() instead of generateRandomDevices(10)
// For example:

export const getDeviceStatus = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.json({ status: devices[deviceIndex].status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDeviceHistory = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    // Simulate history data
    const history = Array.from({ length: 5 }, (_, index) => ({
      timestamp: new Date(Date.now() - index * 1000000000).toISOString(),
      status: devices[deviceIndex].status,
    }));
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDeviceSettings = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    // Simulate settings data
    const settings = {
      brightness: Math.floor(Math.random() * 100),
      volume: Math.floor(Math.random() * 100),
      mode: "Auto",
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDeviceSettings = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    const { brightness, volume, mode } = req.body;
    if (brightness !== undefined) {
      devices[deviceIndex].brightness = brightness;
    }
    if (volume !== undefined) {
      devices[deviceIndex].volume = volume;
    }
    if (mode !== undefined) {
      devices[deviceIndex].mode = mode;
    }
    res.json(devices[deviceIndex]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDeviceType = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.json({ type: devices[deviceIndex].type });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDeviceLocation = (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const devices = initializeDevices();
    const deviceIndex = devices.findIndex((device) => device.id === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.json({ location: devices[deviceIndex].location });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
