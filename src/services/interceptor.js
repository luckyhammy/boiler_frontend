import HttpService from "./htttp.service";

export const setupAxiosInterceptors = (onUnauthenticated) => {
  // Request interceptor
  const onRequestSuccess = async (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  };

  const onRequestFail = (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  };

  HttpService.addRequestInterceptor(onRequestSuccess, onRequestFail);

  // Response interceptor
  const onResponseSuccess = (response) => response;

  const onResponseFail = (error) => {
    console.error("Response interceptor error:", error);
    const status = error.status || (error.response && error.response.status);
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(error);
  };

  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
