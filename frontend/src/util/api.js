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
    const data = JSON.stringify(params);
    console.log(data);
    const response = await api.post("/redeem-voucher/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export const FetchAll = async () => {
  const response = await api.get("/list-of-api/");
  return response.data;
};

export const GenerateApiKey = async (params) => {
  try {
    const data = JSON.stringify(params);
    console.log(data);
    const response = await api.post("/generate-api-key/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export const GetUserApiKey = async (params) => {
  const response = await api.get(`/generate-api-key/${params}`);
  return response;
};
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////new apis
const BASE_URL_V2 = "https://100105.pythonanywhere.com/api/v1";

const api_v2 = axios.create({
  baseURL: BASE_URL_V2,
});

export const GetRedeemVoucher_v2 = async (params) => {
  const response = await api_v2.get(`/redeem-voucher/${params}/`);
  return response.data;
};

export const RedeemVoucher_v2 = async (params) => {
  try {
    const val = { name: params.name, email: params.email };
    const data = JSON.stringify(val);
    console.log(data);
    const response = await api_v2.post(`/redeem-voucher/${params.id}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export const GenerateApiKey_v2 = async (params) => {
  try {
    console.log("the params are ", params);
    const data = JSON.stringify(params);

    const response = await api_v2.post(
      `/generate-api-key/${params.userId}/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const GetApiKey_v2 = async (params) => {
  try {
    const response = await api_v2.get(`/generate-api-key/${params.id}/`);
    return response;
  } catch (error) {
    return error;
  }
};

export const ActivateApiKey_v2 = async (params) => {
  try {
    console.log("the params are.. ", params);
    const val = { voucher_code: params.voucher_code, api_key: params.api_key };
    const data = JSON.stringify(val);
    console.log("the json is", data);

    // const response = await api_v2.put(`/generate-api-key/${params.id}/`, data, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    const response = await fetch(
      `https://100105.pythonanywhere.com/api/v1/generate-api-key/${params.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucher_code: params.voucher_code,
          api_key: params.api_key,
        }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const ActivateService = async (params) => {
  try {
    const response = await fetch(
      `https://100105.pythonanywhere.com/api/v1/activate-api-services/${params.id}/${params.api_key}/${params.service_id}/`
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const UpgradeKey = async (params) => {
  try {
    // const val = { api_key: params.val };
    // const data = JSON.stringify(val);
    // console.log(data);
    // const response = await api_v2.post(`/upgrade/`, data, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return response;
    // console.log(params);
    const response = await fetch(
      `https://100105.pythonanywhere.com/api/v1/upgrade/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: params.val,
        }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};
