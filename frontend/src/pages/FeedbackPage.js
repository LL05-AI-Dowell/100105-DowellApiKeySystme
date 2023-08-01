import React, { useEffect, useState, useRef } from "react";
import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Link,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SentFeedback from "../components/feedback/sentFeedback";
import RecievedFeedback from "../components/feedback/recievedFeedback";

import { CreateRoom, FetchFeedback, SendMessage } from "../util/api";

const FeedbackPage = () => {
  const [message, setMessage] = useState(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState(null);
  const boxRef = useRef(null);
  const session_id = sessionStorage.getItem("session_id");
  const user_info = sessionStorage.getItem("userinfo");

  const SendMsg = async () => {
    if (text !== "") {
      const data = JSON.parse(user_info);
      const id = data.userID;
      const org_id = data.client_admin_id;
      console.log(text);
      console.log(id);
      const res = await SendMessage({
        room_pk: room,
        message: text,
        user_id: id,
        org_id: org_id,
      });
      console.log("the msg res is ", res);
      setText("");
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the box when the component mounts or updates
    const boxElement = boxRef.current;
    boxElement.scrollTop = boxElement.scrollHeight;
    const session_id = sessionStorage.getItem("session_id");
    console.log("the session id is ", session_id);
    const CreateFeedback = async () => {
      const res = await CreateRoom({ session_id: session_id });
      console.log("the feed is ", res);
      if(res == null){
        setMessage(null)
      }else{
      setRoom(res?.room_pk);
      setMessage(res?.messages);
      }
    };
    CreateFeedback();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (room !== null) {
        const res = await FetchFeedback({ room_pk: room });
        setMessage(res.messages);
        console.log(res);
      }
    }, 20000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [room]);

  // console.log("the room is ", room);
  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "90vh" }}>
        <Sidebar page="feedback" />
        <Box
          sx={{ width: { xs: "100%", md: "80%" } }}
          pt={4}
          display={"flex"}
          justifyContent={"center"}
        >
          <Box
            width={"80%"}
            height={"83vh"}
            display={"block"}
            sx={{ width: { xs: "100%", md: "80%" } }}
          >
            <Box
              flexGrow={1}
              height={"72vh"}
              ref={boxRef}
              overflow="auto"
              pb={1}
            >
              {message !== null ?
                message.map((i) => {
                  return i.side === false ? (
                    <SentFeedback key={i.id} data={i.message} />
                  ) : (
                    <RecievedFeedback key={i.id} data={i.message} />
                  );
                }) :  <Typography>Your Session Id is not active</Typography>}
            </Box>
            <Box display={"flex"} justifyContent={"center"} mt={2}>
              <input
                style={{
                  width: "70%",
                  border: "1px solid #005734",
                  borderRadius: "40px",
                  paddingLeft: "15px",
                  fontSize: "16px",
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your feedback here"
              />
              <IconButton sx={{ width: "5%", ml: "10px" }} onClick={SendMsg}>
                <SendIcon sx={{ color: "#005734" }} />
              </IconButton>
              <IconButton sx={{ width: "5%", ml: "10px" }}>
                <CloseIcon sx={{ color: "#005734" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="error">Please enter your feedback!</Alert>
      </Snackbar>
    </div>
  );
};

export default FeedbackPage;
