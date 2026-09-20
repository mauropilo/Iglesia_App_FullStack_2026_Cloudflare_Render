import { useEffect, useRef } from "react";

export function useScanner(alEscanear, { demoraMaximaMs = 80, longitudMinima = 25 } = {}) {
  const buffer = useRef("");
  const ultimaTecla = useRef(0);

  useEffect(() => {
    function manejar(evento) {
      const ahora = performance.now();
      if (ahora - ultimaTecla.current > demoraMaximaMs) buffer.current = "";
      ultimaTecla.current = ahora;
      if (evento.key === "Enter") {
        if (buffer.current.length >= longitudMinima) alEscanear(buffer.current);
        buffer.current = "";
        return;
      }
      if (evento.key.length === 1 && !evento.ctrlKey && !evento.metaKey) buffer.current += evento.key;
    }
    window.addEventListener("keydown", manejar);
    return () => window.removeEventListener("keydown", manejar);
  }, [alEscanear, demoraMaximaMs, longitudMinima]);
}
