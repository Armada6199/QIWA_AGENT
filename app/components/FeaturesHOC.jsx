import "../../styles/recording.css";
import AudioRecorder from "../components/utils/VoiceRecorder";
function FeaturesHOC({ feature, handleClose }) {
  switch (feature) {
    case "speechToText":
      return <AudioRecorder handleClose={handleClose} />;
  }
}

export default FeaturesHOC;
