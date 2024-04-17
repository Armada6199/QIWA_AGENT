import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
export default function CardAudio({ playAudio, pauseAudio, isPlaying }) {
  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            Recored Audio
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            Mohamad Abdin
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pl: 1,
            pb: 1,
          }}
        >
          <IconButton aria-label="play/pause">
            {isPlaying ? (
              <StopIcon sx={{ height: 38, width: 38 }} onClick={pauseAudio} />
            ) : (
              <PlayArrowIcon
                onClick={playAudio}
                sx={{ height: 38, width: 38 }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardMedia component="div" sx={{ width: 151, bgcolor: "primary.main" }} />
    </Card>
  );
}
