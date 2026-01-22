import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

export default function QrScanner({ onResult }) {
    const qrRef = useRef(null);
    const qrCode = useRef(null);

    useEffect(() => {
        if (!qrRef.current) return;

        qrCode.current = new Html5Qrcode(qrRef.current.id);

        Html5Qrcode.getCameras()
            .then((devices) => {
                const backCamera =
                    devices.find((d) =>
                        d.label.toLowerCase().includes("back")
                    ) || devices[0];

                qrCode.current
                    .start(
                        backCamera.id,
                        {
                            fps: 10,
                            qrbox: { width: 260, height: 260 },
                        },
                        (decodedText) => {
                            onResult(decodedText);
                            qrCode.current.stop();
                        }
                    );
            })
            .catch(console.error);

        return () => {
            qrCode.current?.stop().catch(() => { });
        };
    }, []);

    return (
        <div
            id="qr-reader"
            ref={qrRef}
            style={{ width: "100%", maxWidth: 420, margin: "auto" }}
        />
    );
}
