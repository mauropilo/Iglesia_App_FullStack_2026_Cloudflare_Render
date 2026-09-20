import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CameraAlt, StopCircle } from "@mui/icons-material";

export function CameraCapture({ alCapturar }) {
  const video = useRef(null);
  const [stream, setStream] = useState(null);
  useEffect(() => () => stream?.getTracks().forEach((pista) => pista.stop()), [stream]);

  async function iniciar() {
    const nuevo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 720 } }, audio: false });
    setStream(nuevo); video.current.srcObject = nuevo;
  }
  async function capturar() {
    const canvas = document.createElement("canvas");
    canvas.width = video.current.videoWidth; canvas.height = video.current.videoHeight;
    canvas.getContext("2d").drawImage(video.current, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .86));
    alCapturar(blob);
  }
  return <Stack spacing={1.5}><Typography fontWeight={700}>Fotografía</Typography><Box component="video" ref={video} autoPlay muted playsInline sx={{ display: stream ? "block" : "none", width: "100%", maxHeight: 260, borderRadius: 2, bgcolor: "black" }} />{stream ? <Stack direction="row" spacing={1}><Button variant="contained" startIcon={<CameraAlt />} onClick={capturar}>Capturar</Button><Button variant="outlined" startIcon={<StopCircle />} onClick={() => { stream.getTracks().forEach((p) => p.stop()); setStream(null); }}>Cerrar cámara</Button></Stack> : <Button variant="outlined" startIcon={<CameraAlt />} onClick={iniciar}>Tomar foto</Button>}</Stack>;
}
