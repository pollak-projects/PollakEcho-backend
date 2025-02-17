import { Request, Response, NextFunction } from "express";

interface IUserRequest extends Request {
  userRole?: string;
}

export const adminMiddleware = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): void => {
  // Assuming you have a role field in your user model
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Access denied" });
    return; // Return void after sending the response
  }
  next(); // Call next() to proceed to the next middleware/route handler
};
