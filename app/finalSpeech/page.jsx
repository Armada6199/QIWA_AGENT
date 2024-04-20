"use client";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import HelpIcon from "@mui/icons-material/Help";
import MicIcon from "@mui/icons-material/Mic";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useRef, useState } from "react";
import "../../styles/chatbot.css";
import "../../styles/recording.css";
import arContent from "./ar.json";
import { StopCircleOutlined } from "@mui/icons-material";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { glassmorphismStyle } from "@/styles/styles";
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
  const [base64File, setBase64File] = useState([]);

  const [audio, setAudio] = useState(null);
  const [respondSpeech, setRespondSpeech] = useState("");
  const [instance, setInstance] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({ status: false, message: "" });
  const [isClassificationOpen, setIsClassificationOpen] = useState(false);
  const [classificationText, setClassificationText] = useState("");
  const [classificationLabel, setClassificationLabel] = useState("");
  const [audioPlayingStatus, setAudioPlayingStatus] = useState(null);
  const [isOpenDocumentsModal, setIsOpenDocumentsModal] = useState(false);
  const [documentData, setDocumentData] = useState({});
  const audioPlayBack = useRef(null);
  async function preReceiveHandler(event) {
    const headers = {
      "Content-Type": "application/json",
    };
    let options = "";
    const text = event.data.output.generic
      .map((e, index) => {
        if (e.options) {
          e.options.map(
            (option, index) => (options += `${option.label} \n \n \n `)
          );
        } else {
          return e.text;
        }
      })
      .join("");
    setIsLoading({ status: true, message: "Generating Speech from Speech" });
    const chatBotVoice = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/text-to-speech`,
      `${text} ${options} `,
      { headers: headers, responseType: "blob" }
    );

    const sourceData = URL.createObjectURL(chatBotVoice.data);
    if (!audioPlayBack.current) {
      const currentAudio = new Audio(sourceData);
      audioPlayBack.current = currentAudio;
      audioPlayBack.current.addEventListener("play", () => {
        console.log("play started");
        setAudioPlayingStatus("playing");
      });
      audioPlayBack.current.addEventListener("ended", () => {
        console.log("play ended");
        setAudioPlayingStatus("finished");
      });
    }
    audioPlayBack.current.play();
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
    setRecordingStatus("inactive");
    if (audioPlayBack.current) audioPlayBack.current.pause();
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChuncks, { type: mimeType });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudio(audioURL);
      setAudioChuncks([]);
      audioPlayBack.current = null;
      handleSubmit(audioBlob);
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
  const handleCloseClassification = () => setIsClassificationOpen(false);

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
  const handleOpenDocumentDrop = () => setIsOpenDocumentsModal(true);
  const handleCloseDocumentsModal = () => setIsOpenDocumentsModal(false);
  const handleFileUpload = async (event) => {
    const headers = {
      "Content-Type": "application/json",
    };
    var file = event.target.files[0];
    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
    const base64 = await convertBase64(file);
    // console.log(base64.split(",")[1]);
    setBase64File(base64);
    setIsLoading({ status: true });
    const documentResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/extractDocumentData`,
      base64.split(",")[1],
      { headers: headers }
    );
    setIsLoading({ status: false });
    console.log(documentResponse);
    setDocumentData(documentResponse.data);
  };
  useEffect(() => {
    instance?.on({
      type: "chat:ready",
      handler: () => setIsOpen(true),
    });
    instance?.on({
      type: "view:change",
      handler: () => setIsOpen((prev) => !prev),
    });
    const updateLocale = async () => await instance?.updateLocale("ar");
    updateLocale();
  }, [instance]);
  return (
    <Grid container>
      {isLoading.status && isOpen && (
        <Box position={"absolute"} bottom={150} left={200} zIndex={999999}>
          <span class="loader"></span>
          {/* <Typography variant="body2">{isLoading.message}</Typography> */}
        </Box>
      )}
      {isOpen && (
        <Box
          position={"absolute"}
          bottom={30}
          left={40}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            recordingStatus == "recording" ? stopRecording() : startRecording()
          }
          zIndex={999999}
        >
          <MicIcon
            color="primary.main"
            className={recordingStatus === "inactive" ? "" : "pulse_recording"}
            sx={{ width: 32, height: 32, color: "primary.main" }}
          />
        </Box>
      )}
      {isOpen && (
        <Box
          position={"absolute"}
          bottom={30}
          left={80}
          sx={{ cursor: "pointer" }}
          onClick={handleOpenClassification}
          zIndex={999999}
        >
          <HelpIcon sx={{ width: 32, height: 32, color: "primary.main" }} />
        </Box>
      )}
      {isOpen && (
        <Box
          position={"absolute"}
          bottom={30}
          left={120}
          sx={{ cursor: "pointer" }}
          onClick={handleOpenDocumentDrop}
          zIndex={999999}
        >
          <DocumentScannerIcon
            sx={{ width: 32, height: 32, color: "primary.main" }}
          />
        </Box>
      )}
      {audioPlayingStatus && (
        <Box
          position={"absolute"}
          bottom={30}
          left={160}
          sx={{ cursor: "pointer" }}
          zIndex={999999}
        >
          {audioPlayingStatus === "playing" ? (
            <StopCircleOutlined
              color="primary.main"
              onClick={() => {
                console.log(audioPlayBack.current);
                audioPlayBack.current.pause();
                setAudioPlayingStatus("stopped");
              }}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <ReplayIcon
              onClick={() => {
                audioPlayBack.current.play();
                setAudioPlayingStatus("playing");
              }}
              color="primary.main"
              sx={{ width: 32, height: 32 }}
            />
          )}
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
      <Modal
        open={isOpenDocumentsModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        onClose={handleCloseDocumentsModal}
      >
        <Grid container item md={6} sx={glassmorphismStyle} p={4} gap={4}>
          <Grid container item>
            <Grid item xs={12} textAlign={"center"}>
              <Typography variant="h6">قم برفع هويتك الشخصية</Typography>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <Paper
              variant="outlined"
              style={{
                border: true
                  ? "2px dashed secondary.dark"
                  : "2px dashed #C4B28F",
                padding: 20,
                textAlign: "center",
                cursor: "pointer",
                background: true ? "#fff" : "#fafafa",
                borderRadius: "20px",
              }}
            >
              <input
                accept="image/*,.pdf"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="raised-button-file">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <CloudUploadIcon
                      sx={{ fontSize: 60, color: "primary.main" }}
                    />
                  </IconButton>
                  <Typography variant="body1" fontWeight={600}>
                    انقر هنا لرفع الملفات من جهازك الشخصي
                  </Typography>
                  <Typography
                    variant="body2"
                    color={"darkgray"}
                    fontWeight={500}
                  >
                    pdf الرجاء رفع صورة او ملف{" "}
                  </Typography>
                </Box>
              </label>
            </Paper>
          </Grid>
          {documentData && Object.keys(documentData).length === 0 && (
            <Grid item xs={12}>
              <Typography textAlign={"center"} variant="h6">
                ستظهر معلوماتك هنا بعد تحميلها
              </Typography>
            </Grid>
          )}
          {isLoading.status && (
            <Grid container item justifyContent={"center"}>
              <Grid item xs={12}>
                <Typography textAlign={"center"} variant="h6">
                  {" "}
                  يتم التحميل ....
                </Typography>
              </Grid>
              <span class="loader"></span>
            </Grid>
          )}
          <Grid
            container
            item
            justifyContent={"center"}
            sx={{ direction: "ltr" }}
          >
            {Object.keys(documentData).map((key, i) => {
              return (
                <Grid container item>
                  <Grid item key={i} xs={6}>
                    <Typography>{key}</Typography>
                  </Grid>
                  <Grid item key={i} xs={6}>
                    <Typography>{documentData[key]}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Modal>
      <WebChatContainer config={webChatOptions} onBeforeRender={setInstance} />
    </Grid>
  );
}

export default page;
