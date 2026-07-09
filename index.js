import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "connecting") {
      if (!sock.authState.creds.registered) {
        try {
          const code = await sock.requestPairingCode("249125270800");
          console.log("PAIRING CODE:", code);
        } catch (err) {
          console.error("PAIRING ERROR:", err);
        }
      }
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }

    if (connection === "close") {
      console.log("❌ Connection Closed");
    }
  });
}

startBot();
