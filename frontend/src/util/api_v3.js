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
export const GetApiKey_v3 = async (params) => {
  try {
    const response = await api_v3.get(
      `/user/?type=get_api_key&workspace_id=${params.id}`
    );
    return response;
  } catch (error) {
    console.log("error getting api key", error);
  }
};
export const UpdateApiKey_v3 = async (params) => {
  try {
    const response = await api_v3.get(
      `/service-update/?api_key=${params.api_key}`
    );
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
    console.log("the data is ", data);

    const response = await api_v3.post(
      `/service/?type=add_services&password=${params.password}`,
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

////////
///////////////payment
export const InitializePay_Stripe = async (params) => {
  try {
    const res = await axios.post(
      "https://100088.pythonanywhere.com/api/stripe/initialize",
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const InitializePay_Paypal = async (params) => {
  try {
    const res = await axios.post(
      "https://100088.pythonanywhere.com/api/paypal/initialize",
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const VerifyPay_Paypal = async (params) => {
  try {
    const res = await axios.post(
      "https://100088.pythonanywhere.com/api/verify/payment/paypal",
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
export const VerifyPay_Stripe = async (params) => {
  try {
    const res = await axios.post(
      "https://100088.pythonanywhere.com/api/verify/payment/stripe",
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

///////
///////upgrade Credit

export const UpgradeCredit_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/user/?type=upgrade_credits&api_key=${params.api_key}`,
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error upgrading credit ", error);
  }
};

/////// voucher coupon system
export const ClaimVoucher_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/voucher/?type=claim_voucher&workspace_id=${params.id}`,
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const GetNotRedeemedVouchers_v3 = async (params) => {
  try {
    const response = api_v3.get(
      `/voucher/?type=workspace_voucher&action=verified&action=unverified&action=not_redeemed&workspace_id=${params.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const GetRedeemedVouchers_v3 = async (params) => {
  try {
    const response = api_v3.get(
      `/voucher/?type=workspace_voucher&action=verified&action=redeemed&workspace_id=${params.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const GetAllVouchers_v3 = async (params) => {
  try {
    const response = api_v3.get(
      `/voucher/?type=workspace_voucher&action=not_redeemed&workspace_id=${params.id}&action=all`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const RedeemVoucher_v3_1 = async (params) => {
  try {
    const response = await api_v3.post(
      `/voucher/?type=redeem_voucher&&workspace_id=${params.id}`,
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const RedeemVoucher_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/voucher/?type=redeem_voucher&voucher_id=${params.id}`,
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const TopupPublicVoucher_v3 = async(params)=>{
  try {
    const response = await api_v3.post(
      `/public-voucher/?type=topup_public_voucher`,
      params.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

/////////////admin duties
//////////////////////////
export const GetAllWorkspaces_v3 = async () => {
  try {
    const response = api_v3.get(`/platform-admin/?type=get_all_workspaces`);
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const RestrictWorkspace_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/platform-admin/?type=restrict_workspace_key&workspace_id=${params.id}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const GetVoucherDetails_v3 = async () => {
  try {
    const response = api_v3.get(
      `/voucher/?type=verification_voucher&action=verified`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const VerifyVoucher_v3 = async (params) => {
  try {
    const response = await api_v3.post(
      `/voucher/?type=verify_voucher_redemption&voucher_id=${params.id}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};