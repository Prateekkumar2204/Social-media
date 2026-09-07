import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoCall = () => {
    const containerRef = useRef(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (!containerRef.current) return;

        const appID = 313680763;
        const serverSecret = "542aa51e305cfadb160425d9590bdd8e";
        const roomID = searchParams.get("room") || "main";

        const userID = "user_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
        const userName = "User_" + Math.floor(Math.random() * 1000);

        console.log("Room ID:", roomID);
        console.log("ZEGO User ID:", userID);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showPreJoinView: true,
            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: true,
            showScreenSharingButton: false,
            showTextChat: false,
            maxUsers: 2,
        });

        return () => {
            try {
                zp.destroy();
            } catch (error) {
                console.error("ZEGO cleanup error:", error);
            }
        };
    }, [searchParams]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                background: "#000"
            }}
        ></div>
    );
};

export default VideoCall;