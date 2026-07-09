import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import dotenv from "dotenv";

dotenv.config();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ qr, connection }) => {
    if (qr) {
      console.log("QR جاهز، افتحه من Railway Logs");
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }
  });
}

startBot();
