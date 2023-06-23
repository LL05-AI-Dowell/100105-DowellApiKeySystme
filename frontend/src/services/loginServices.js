import axios from "axios";

const loginAxiosInstance = axios.create({
    baseURL: "https://100014.pythonanywhere.com/api"
})

const portfolioAxiosInstance = axios.create({
    baseURL: "https://100093.pythonanywhere.com/api"
})

export const getUserInfoFromPortfolio = async (session_id) => {
    return await portfolioAxiosInstance.post("/userinfo/", { session_id })
};

export const getUserInfoFromLogin = async (session_id, product=null) => {
    if (product ) return await loginAxiosInstance.post("/userinfo/", { 
        product: product, 
        session_id: session_id 
    })

    return await loginAxiosInstance.post("/userinfo/", { 
        session_id 
    })
};
