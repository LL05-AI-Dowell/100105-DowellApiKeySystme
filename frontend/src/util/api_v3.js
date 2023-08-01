import axios from "axios";

const BASE_URL = "https://100105.pythonanywhere.com/api/v3";

const api_v3 = axios.create({
  baseURL: BASE_URL,
});

///API KEY
export const CreateApiKey_v3 = async (params) => {
  try {
    const data = JSON.stringify(params);

    const response = await api_v3.post(`/user/?type=create_api_key`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log("Error creating api key ", error);
  }
};

export const ActivateApiKey_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/user/?type=activate_key&api_key=${params}`
    );
    return response;
  } catch (error) {
    console.log("Error activating api key ", error);
  }
};

export const DeactivateApiKey_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/user/?type=deactivate_key&api_key=${params}`
    );
    return response;
  } catch (error) {
    console.log("Error deactivating api key ", error);
  }
};
export const GetApiKey_v3 = async(params)=>{
  try {
    const response = await api_v3.get(`/user/?type=get_api_key&user_id=${params.userId}`);
    return response;
  } catch (error) {
    console.log("error getting api key", error);
  }
}
export const UpdateApiKey_v3 = async (params) => {
  try {
    const response = await api_v3.get(`/service-update/?api_key=${params.api_key}`);
    return response;
  } catch (error) {
    console.log("error getting api key", params.api_key, error);
  }

  // try {
  //   const response = await fetch(
  //     `https://100090.pythonanywhere.com/api/v3/service-update/?api_key=3989f33e-9c26-4420-9bab-6ce64d8145ec`
  //   );

  //   const result = await response.json();
  //   return result;
  // } catch (error) {
  //   return error;
  // }
};


///Voucher
export const AddVoucher_v3 = async (params) => {
  try {
    const data = JSON.stringify(params);

    const response = await api_v3.post(`/voucher/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log("Error adding a voucher ", error);
  }
};

export const GetVoucher = async () => {
  try {
    const response = await api_v3.get("/voucher/");
    return response;
  } catch (error) {
    console.log("error getting voucher ", error);
  }
};

///Service
export const GetAllService_v3 = async () => {
  try {
    const response = await api_v3.get("/service/?type=get_all_services");
    return response;
  } catch (error) {
    console.log("error getting all services ", error);
  }
};

export const GetService_v3 = async (params) => {
  try {
    const response = await api_v3.get(
      `/service/?type=get_service&service_id=${params}`
    );
    return response;
  } catch (error) {
    console.log("error getting the service ", error);
  }
};

export const AddService_v3 = async (params) => {
  try {
    const data = JSON.stringify(params.data);
    console.log("the data is ", data)

    const response = await api_v3.post(`/service/?type=add_services&password=${params.password}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log("Error adding service ", error);
  }
};

export const ActivateService_v3 = async (params) => {
  try {
    const data = JSON.stringify({ service_id: params.service_id });

    const response = await api_v3.post(
      `/user/?type=activate_service&api_key=${params.api_key}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error adding service ", error);
  }
};
