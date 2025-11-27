import { getTokens, setTokens, removeTokens } from "./token";


export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, refreshToken } = getTokens();

  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  
  let response = await fetch(url, {
    ...options,
    headers,
  });

  
  if (response.status === 401 && refreshToken) {
    console.log("Access token expired, attempting to refresh...");
    
    try {
      
      const refreshResponse = await fetch("http://localhost:8080/project/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.data?.token?.accessToken;
        const newRefreshToken = data.data?.token?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          
          setTokens(newAccessToken, newRefreshToken);

          
          response = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        }
      } else {
        
        removeTokens();
        localStorage.removeItem("user");
        throw new Error("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      removeTokens();
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}