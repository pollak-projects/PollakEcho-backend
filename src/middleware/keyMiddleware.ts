//verify api key attached to the request with a different backend /verify endpoint
//https://auth.pollak.info/
import { Request, Response, NextFunction } from "express";

export const keyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const key = req.header("x-api-key");
  if (!key) {
    res.status(401).send("No API key provided");
    return;
  }

  const response = await fetch("https://auth.pollak.info/apiKey/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
    },
  });

  if (response.status !== 200) {
    res.status(401).send("Invalid API key");
    return;
  }
  next();
};
