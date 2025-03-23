import axios, { AxiosError } from "axios";

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  "not-before-policy": number;
  scope: string;
}

export class TokenCache {
  private static cache: Map<
    string,
    {
      token: string;
      expiryTime: number;
    }
  > = new Map();

  static storeToken(clientId: string, token: string, expiresIn: number): void {
    const expiryTime = Date.now() + expiresIn * 1000;
    this.cache.set(clientId, { token, expiryTime });
  }

  static getToken(clientId: string): string | undefined {
    const cachedToken = this.cache.get(clientId);
    if (!cachedToken) return undefined;

    // Check if token is still valid (with 30-second buffer)
    if (Date.now() < cachedToken.expiryTime - 600000) {
      return cachedToken.token;
    }

    // Token is expired or near expiry
    this.cache.delete(clientId);
    return undefined;
  }
}

export class KeycloakMiddleware {
  private static readonly KEYCLOAK_TOKEN_ENDPOINT =
    "http://keycloak-deploy-headless.default.svc.cluster.local:8080/realms/master/protocol/openid-connect/token";
  private static readonly TOKEN_TYPE = "Bearer";

  private static async obtainAccessToken(): Promise<string> {
    console.log("Obtaining new Keycloak access token");
    try {
      const response = await axios.post<KeycloakTokenResponse>(
        KeycloakMiddleware.KEYCLOAK_TOKEN_ENDPOINT,
        new URLSearchParams({
          client_id: process.env.CLIENT_ID || "",
          client_secret: process.env.CLIENT_SECRET || "",
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Obtained new access token", response.data);

      TokenCache.storeToken(
        process.env.CLIENT_ID!,
        `${response.data.token_type} ${response.data.access_token}`,
        response.data.expires_in
      );

      return TokenCache.getToken(process.env.CLIENT_ID!)!;
    } catch (error) {
      console.log("Error obtaining token", error);
      throw new Error(
        `Failed to obtain Keycloak access token: ${
          (error as AxiosError)?.response?.data ?? error
        }`
      );
    }
  }

  public static async authMiddleware(
    req: any,
    res: any,
    next: Function
  ): Promise<void> {
    try {
      const cachedToken = TokenCache.getToken(process.env.CLIENT_ID!);

      console.log("Cached token", cachedToken);

      if (!cachedToken) {
        console.log("Token not found in cache, obtaining new token");
        await KeycloakMiddleware.obtainAccessToken();
      }

      req.headers.authorization = TokenCache.getToken(process.env.CLIENT_ID!)!;
      next();
    } catch (error) {
      res.status(401).json({
        error: "Authentication failed",
        details: (error as Error).message,
      });
    }
  }
}
