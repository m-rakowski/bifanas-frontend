import React, {useCallback, useEffect, useRef} from "react";
import jsQR from "jsqr";

export default function JsqrScanner({onScanned}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const getVideo = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {width: 250, height: 250}
        });
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();

    }, [videoRef]);

    const takePhoto = useCallback(() => {
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
    }, [videoRef, canvasRef]);

    useEffect(() => {
        getVideo();

        const interval = setInterval(() => {
            takePhoto();
        }, 2000);
        return function () {
            clearInterval(interval);
        };
    }, [getVideo, takePhoto])

    return (<>
        <canvas ref={canvasRef} hidden={true}/>
        <video ref={videoRef} autoPlay playsInline controls={false}/>
    </>);
}
