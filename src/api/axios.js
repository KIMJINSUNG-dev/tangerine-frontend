import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");
    if (token) {

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(

    (response) => response,
    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/users/reissue")
        ) {

            originalRequest._retry = true;

            try {

                const response = await api.post("/api/users/reissue");
                const newAccessToken = response.data;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (reissueError) {

                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;