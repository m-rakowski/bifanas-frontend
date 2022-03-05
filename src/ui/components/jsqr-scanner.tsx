import React, {useCallback, useEffect, useRef, useState} from "react";
import jsQR from "jsqr";

export interface JsqrScannerProps {
    onScanned: (data: string) => void
}

export const JsqrScanner: React.FC<JsqrScannerProps> = ({onScanned}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState(null);

    const takePhoto = useCallback(() => {
        console.log('takePhoto');

        const width = 250;
        const height = 250;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const code = jsQR(frame.data, width, height, {});

        if (code) {
            onScanned(code.data);
        }
    }, [videoRef, canvasRef, onScanned]);


    useEffect(() => {
        async function enableStream() {
            try {

                let devices = await navigator.mediaDevices.enumerateDevices();
                if (devices.length === 0 || devices[0].deviceId === "") {
                    // start and stop camera to ask for permissions so that enumerateDevices() shows rear camera
                    (await navigator.mediaDevices.getUserMedia({video: true})).getVideoTracks().forEach(track => track.stop());
                    devices = await navigator.mediaDevices.enumerateDevices();
                }

                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const lastDevice = videoDevices[videoDevices.length - 1];

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 250,
                        height: 250,
                        deviceId: {
                            exact: lastDevice.deviceId
                        }
                    }
                });
                setMediaStream(stream);

                const video = videoRef.current;
                video.srcObject = stream;
                video.play();
            } catch (err) {
                console.log(err);
            }
        }

        let interval = setInterval(() => {
            takePhoto();
        }, 500);

        if (!mediaStream) {
            enableStream();
        }
        return function cleanup() {
            mediaStream?.getTracks().forEach(track => {
                track.stop();
            });
            clearInterval(interval);
        }
    }, [mediaStream, takePhoto]);


    return (<>
        <canvas ref={canvasRef} hidden={true}/>
        <video ref={videoRef} autoPlay playsInline controls={false}/>
    </>);
};
