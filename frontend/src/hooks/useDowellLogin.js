import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { dowellLoginUrl } from "../utils";
import { getUserInfoFromLogin, getUserInfoFromPortfolio } from "../services/loginServices";
import { useUserContext } from "../contexts/UserContext";


export default function useDowellLogin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setAppLoading, currentLocalSession, setCurrentLocalSession, setCurrentUser } = useUserContext();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const id = searchParams.get("id");

    if (session_id) {
      sessionStorage.setItem("session_id", session_id);
      setCurrentLocalSession(true);
      setAppLoading(false);
      
      if (id) {
        sessionStorage.setItem("id", id);
        getUserInfoFromPortfolio(session_id).then(res => {
            setCurrentUser(res.data);
        }).catch(err => {
            console.log(err);
            console.log('Failed to get user data from portfolio');
        });
      } else {
        getUserInfoFromLogin(session_id).then(res => {
            setCurrentUser(res.data);
            const val = JSON.stringify(res.data.userinfo.client_admin_id)
            sessionStorage.setItem('key2', val);
        }).catch(err => {
            console.log(err);
            console.log('Failed to get user data from login');
        });
      }
    }
    if (!currentLocalSession && !session_id) {
      window.location.replace(dowellLoginUrl);
    }
  }, []);
}