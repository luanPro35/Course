import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "@/utils/token";


// 1.create one axios instance with config basic
const api = axios.create({
    // URL cơ sở của BE, đã bao gồm context-path từ file application.yaml
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/project', 
    headers: {
        'Content-Type' : 'application/json'
    },
});
//2.config request interceptor(enclose token to header)
//interceptor will run before request is sent
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        //if having token add it to header
        if (token && !config.headers.Authorization) { // Chỉ thêm nếu chưa có
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
)
//3.config response interceptor(Handler token expired)
//interceptor will run after receive response from server
let isRefreshing = false;
let failedQueue: {
    resolve: (value: unknown) => void; 
    reject: (reason?: unknown) => void
}[] = [];

const processQueue = (error: unknown, token : string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
api.interceptors.response.use(
    (response) => {
        //if success return response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // if error 401 (Unauthorized) and request is not original request
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                //if having one request refresh token, we will add request to queue
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                })
                    .then(token=>{
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
                    }
            }
            originalRequest._retry = true;
            isRefreshing = true;
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                //if haven't refreshToken, no do anything, logout user
                // Chuyển hướng về trang đăng nhập của FE
                removeTokens();
                window.location.href = '/auth/login';
                return Promise.reject(error);
            }
            try{
                // Call API to get new token from refresh token
                // SỬA LẠI: Endpoint đúng là /auth/refresh-token
                const rs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                    // SỬA LẠI: BE mong muốn nhận key là "token"
                    token: refreshToken,
                });
                // BE trả về một object TokenResponse, không phải AuthenticatedResponse
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = rs.data.result;

                //save new token
                setTokens(newAccessToken, newRefreshToken);

                //update new token to header request initial and perform retry it
                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                //perform retry request having queue
                processQueue(null, newAccessToken);
                return api(originalRequest);
                } catch (error) {
                    //if refreshToken error
                    processQueue(error, null);
                    removeTokens();
                    // SỬA LẠI: Chuyển hướng về trang đăng nhập của FE
                    window.location.href = '/auth/login'; 
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }

        return Promise.reject(error);
    });
export default api;
