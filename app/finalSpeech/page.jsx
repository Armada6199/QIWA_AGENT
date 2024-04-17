"use client";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import AssistantIcon from "@mui/icons-material/Assistant";
import MicIcon from "@mui/icons-material/Mic";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../../styles/chatbot.css";
import "../../styles/recording.css";
import arContent from "./ar.json";
import HelpIcon from "@mui/icons-material/Help";
function customResponseHandler(event) {
  const { message, element, fullMessage } = event.data;
  console.log(message);
}

const webChatOptions = {
  integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID,
  region: process.env.NEXT_PUBLIC_REGION,
  serviceInstanceID: process.env.SERVICE_INSTANCE_ID,
};
const mimeType = "audio/mp3";

function page() {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChuncks, setAudioChuncks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [respondSpeech, setRespondSpeech] = useState("");
  const [instance, setInstance] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({ status: false, message: "" });
  const [isClassificationOpen, setIsClassificationOpen] = useState(false);
  const [classificationText, setClassificationText] = useState("");
  const [classificationLabel, setClassificationLabel] = useState("");
  async function preReceiveHandler(event) {
    const headers = {
      "Content-Type": "application/json",
    };
    const message = event.data;
    let options = "";
    const text = event.data.output.generic
      .map((e, index) => {
        if (e.options) {
          e.options.map((option, index) => (options += `${option.label}`));
        } else {
          return e.text;
        }
      })
      .join("");
    setIsLoading({ status: true, message: "Generating Speech from Speech" });
    const chatBotVoice = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/text-to-speech`,
      `${text} ${options}`,
      { headers: headers, responseType: "blob" }
    );
    instance?.on({
      type: "customResponse",
      handler: customResponseHandler,
    });
    if (message.output.generic) {
      const sourceData = URL.createObjectURL(chatBotVoice.data);
      console.log(message.output.generic);
      message.output.generic[3] = {
        response_type: "audio",
        source: sourceData,
      };
    }
    setIsLoading({ status: false, message: "" });
  }
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
    setRecordingStatus("recording");
    const stream = await getMicrophonePermission();
    console.log(stream);
    const media = new MediaRecorder(stream, {
      type: mimeType,
    });
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
  function handleOpenClassification() {
    setIsClassificationOpen(true);
  }
  const stopRecording = () => {
    console.log("stop");
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChuncks, { type: mimeType });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudio(audioURL);
      setAudioChuncks([]);
      const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
      };
      handleSubmit(audioBlob);
    };
  };
  const handleCloseClassification = () => setIsClassificationOpen(false);
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
      setIsLoading({ status: true, message: "Generating text from Speech" });
      blobToBase64(audioBlob, async function (base64String) {
        const clientText = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/speech-to-text`,
          base64String,
          { headers: headers }
        );
        // console.log(clientText.data);
        instance.send(clientText.data);
        instance?.on({
          type: "pre:receive",
          handler: (event) => preReceiveHandler(event),
        });
        setIsLoading({ status: false, message: "" });
      });
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };
  async function handleSubmitClassification() {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      console.log(classificationText);
      const classification = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/classifyV1`,
        `${classificationText}`,
        { headers: headers, responseType: "text" }
      );
      console.log(classification);
      setClassificationLabel(classification.data);
      // handleCloseClassification();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  useEffect(() => {
    if (respondSpeech) {
      console.log(respondSpeech);
    }
    instance?.updateCSSVariables();
  }, [instance, respondSpeech]);
  useEffect(() => {
    instance?.on({ type: "receive", handler: () => setIsOpen(true) });
    const updateLocale = async () => await instance?.updateLocale("ar");
    updateLocale();
  }, [instance]);
  return (
    <Grid container>
      {isLoading.status && isOpen && (
        <Box position={"absolute"} bottom={150} right={100} zIndex={999999}>
          <span class="loader"></span>
          <Typography variant="body2">{isLoading.message}</Typography>
        </Box>
      )}
      {isOpen && (
        <Box
          position={"absolute"}
          bottom={30}
          right={40}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            !permission
              ? getMicrophonePermission()
              : recordingStatus == "recording"
              ? stopRecording()
              : startRecording()
          }
          zIndex={999999}
        >
          <MicIcon
            color="primary.main"
            className={recordingStatus === "inactive" ? "" : "pulse_recording"}
            sx={{ width: 32, height: 32 }}
          />
        </Box>
      )}
      {isOpen && (
        <Box
          position={"absolute"}
          bottom={30}
          right={80}
          sx={{ cursor: "pointer" }}
          onClick={handleOpenClassification}
          zIndex={999999}
        >
          <HelpIcon color="primary.main" sx={{ width: 32, height: 32 }} />
        </Box>
      )}
      <Dialog
        fullWidth={"xl"}
        onClose={handleCloseClassification}
        open={isClassificationOpen}
      >
        <DialogTitle>{arContent.dialog.header}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline={true}
            sx={{ height: 100 }}
            value={classificationText}
            onChange={(e) => setClassificationText(e.target.value)}
            placeholder={arContent.dialog.textArea_placeholder}
          />
          <Typography variant="h6" textAlign={"center"}>
            {classificationLabel.length > 0 &&
              "  " + "    استفسارك متعلق بخدمة"}
            {" " + classificationLabel + "  "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClassification}>
            {arContent.dialog.cancel_button}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitClassification}
            autoFocus
          >
            {arContent.dialog.send_button}
          </Button>
        </DialogActions>
      </Dialog>
      <WebChatContainer config={webChatOptions} onBeforeRender={setInstance} />
    </Grid>
  );
}

export default page;
