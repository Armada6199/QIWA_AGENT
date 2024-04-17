"use client";
import axios from "axios";
import { useRef, useState } from "react";
// import sendAudioForm from "./sendAudioForm";
import MicIcon from "@mui/icons-material/Mic";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import "../../../styles/recording.css";

const mimeType = "audio/mp3";

const AudioRecorder = ({ setSpeechText }) => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChuncks, setAudioChuncks] = useState([]);
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, SetIsPlaying] = useState(false);
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
    const stream = await getMicrophonePermission();
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { type: mimeType });
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
      // saveAs(audioBlob, "audio1.mp3");
      handleSubmit(audioBlob);
      // ->>>>>>>>> saveAs(audioBlob, 'audio1'); <<<<<<<<<<<
    };
  };
  function playAudio() {
    SetIsPlaying(true);
    audioRef.current.play();
  }

  function pauseAudio() {
    SetIsPlaying(false);
    audioRef.current.pause();
  }
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/speech-to-text?`,
          base64String,
          { headers: headers }
        );
        console.log(response);
        setSpeechText(response.data);
        // toggleWebChat();
      });
    } catch (error) {
      // Handle any errors (e.g., display an error message)
      console.error("Error uploading video:", error);
    }
  };
  return (
    <Box
      display={"flex"}
      height={"400px"}
      width={"400px"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      color={"#fff"}
      textAlign={"center"}
      bgcolor={"primary.main"}
      borderRadius={"50%"}
      position={"relative"}
      className={recordingStatus === "inactive" ? "" : "pulse_recording"}
    >
      <MicIcon sx={{ fontSize: 124 }} />
      {recordingStatus === "inactive" ? (
        <Button onClick={startRecording} sx={{ color: "#fff", fontSize: 24 }}>
          Start Recording
        </Button>
      ) : null}
      {recordingStatus === "recording" ? (
        <Button onClick={stopRecording} sx={{ color: "#fff", fontSize: 24 }}>
          stop Recording
        </Button>
      ) : null}
      {audio ? (
        <Box display={"none"}>
          <audio src={audio} ref={audioRef} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </Box>
      ) : null}
    </Box>
  );
};

export default AudioRecorder;
