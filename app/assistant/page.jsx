"use client";

import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import {
  MicOutlined,
  VideoCameraBackOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import { Grid, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import "../../styles/recording.css";
import "../../styles/chatbot.css";
import VideoRecorder from "../components/utils/VideoRecored";
const mimeType = "audio/mp3";

const webChatOptions = {
  integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID,
  region: process.env.NEXT_PUBLIC_REGION,
  serviceInstanceID: process.env.SERVICE_INSTANCE_ID,
};
function page() {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChuncks, setAudioChuncks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [respondSpeech, setRespondSpeech] = useState("");
  const [instance, setInstance] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const handleOpen = (text) => {
    setIsVideoOpen(true);
  };
  const handleClose = () => {
    setIsVideoOpen(false);
  };
  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
        return streamData;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The mediaRecorder API is not Supported in your browser");
    }
  };
  const startRecording = async () => {
    const streamMedia = await getMicrophonePermission();
    setRecordingStatus("recording");
    const media = new MediaRecorder(streamMedia, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChuncks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChuncks.push(event.data);
    };
    setAudioChuncks(localAudioChuncks);
  };
  // try to use asysnc(e) here as in predict application
  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChuncks, { type: mimeType });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudio(audioURL);
      setAudioChuncks([]);
      // Create a file name for the recording

      const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
      };
      saveAs(audioBlob, "audio1.mp3");
      handleSubmit(audioBlob);
      // ->>>>>>>>> saveAs(audioBlob, 'audio1'); <<<<<<<<<<<
    };
  };
  function blobToBase64(blob, callback) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64String = reader.result.split(",")[1];
      callback(base64String);
    };
    reader.readAsDataURL(blob);
  }
  const handleSubmit = async (audioBlob) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      blobToBase64(audioBlob, async function (base64String) {
        const clientText = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/speech-to-text?lang=en`,
          base64String,
          { headers: headers }
        );
        // console.log(clientText.data);
        instance.send(clientText.data);
        // instance?.on({
        //   type: "receive",
        //   handler: async (e) => {
        //     const chatBotVoice = await axios.post(
        //       `${process.env.NEXT_PUBLIC_BACKEND_API}/api/text-to-speech?lang=ar`,
        //       e.data.output.generic[0].text,
        //       { headers: headers }
        //     );
        //     console.log(chatBotVoice.data, "chat bot voice resposne ");
        //     setRespondSpeech(chatBotVoice.data);
        //   },
        // });
        // toggleWebChat();
      });
    } catch (error) {
      // Handle any errors (e.g., display an error message)
      console.error("Error uploading video:", error);
    }
  };
  useEffect(() => {
    console.log(respondSpeech);
  }, [respondSpeech]);
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      height={"calc(100vh - 60px)"}
    >
      {instance && (
        <>
          <Box
            sx={{
              position: "absolute",
              bottom: "32px",
              right: "50px",
              zIndex: 2147483647,
              cursor: "pointer",
            }}
            onClick={() =>
              recordingStatus == "inactive" ? startRecording() : stopRecording()
            }
          >
            <MicOutlined
              className={
                recordingStatus == "recording" ? "pulse_recording" : ""
              }
              sx={{
                width: 48,
                height: 24,
                color: "primary.main",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "32px",
              right: "100px",
              zIndex: 2147483647,
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <VideocamOutlined
              sx={{ width: 48, height: 24, color: "primary.main" }}
            />
          </Box>
        </>
      )}
      <Modal
        open={isVideoOpen}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          border: "none",
        }}
      >
        <Grid
          container
          item
          md={6}
          justifyContent={"center"}
          p={4}
          position={"relative"}
          sx={{
            outline: "none",
            border: "none",
          }}
        >
          <VideoRecorder setVideoSpeech={setRespondSpeech} />
        </Grid>
      </Modal>
      <WebChatContainer config={webChatOptions} onBeforeRender={setInstance} />{" "}
    </Grid>
  );
}

export default page;
