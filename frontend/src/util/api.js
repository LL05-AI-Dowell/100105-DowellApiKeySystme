import axios from "axios";

const BASE_URL = "https://100105.pythonanywhere.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

export const GetRedeemVoucher = async (params) => {
  const response = await api.get(`/redeem-voucher/${params}/`);
  return response.data;
};

export const RedeemVoucher = async (params) => {
  try {
    const data = JSON.stringify(params)
    console.log(data)
    const response = await api.post(
      "/redeem-voucher/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return null
  }
};

export const FetchAll = async()=>{
    const response = await api.get('/list-of-api/');
    return response.data
}

export const GenerateApiKey = async(params)=>{
    try {
        const data = JSON.stringify(params)
        console.log(data)
        const response = await api.post(
          "/generate-api-key/",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response;
      } catch (error) {
        return null
      }
}

export const GetUserApiKey = async(params)=>{
    const response = await api.get(`/generate-api-key/${params}`)
    return response
}