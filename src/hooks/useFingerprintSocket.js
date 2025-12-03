// src/hooks/useFingerprintSocket.js
import { useEffect, useState } from "react";

export function useFingerprintSocket(serverUrl = "ws://localhost:8080") {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(serverUrl);

    socket.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket de huellas");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setData(json);
        console.log("📥 Huella recibida:", json);
      } catch (e) {
        console.error("❌ Error parseando JSON:", e);
      }
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket cerrado");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("⚠️ Error en WebSocket:", err);
    };

    return () => socket.close();
  }, [serverUrl]);

  return { connected, data };
}
