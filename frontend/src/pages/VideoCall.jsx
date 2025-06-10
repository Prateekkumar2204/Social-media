import React, { useEffect } from 'react';
import "../Scss/VideoCall.scss";

const VideoCall = () => {
    let APP_ID = "7f251e436fa84451a507453ec054fcc2";
    let uid = String(Math.floor(Math.random() * 10000));
    let token = null;

    let client;
    let channel;

    let localStream;
    let remoteStream;
    let peerConnection;

    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
    };

    let isInitialized = false;

    let init = async () => {
        try {
            if (!isInitialized) {
                isInitialized = true;

                if (!window.AgoraRTM || typeof window.AgoraRTM.createInstance !== 'function') {
                    throw new Error("AgoraRTM SDK is not loaded. Check your CDN link in index.html.");
                }

                const response = await fetch(`http://localhost:3000/api/getAgoraToken?uid=${uid}`);
                const data = await response.json();
                token = data.token;

                client = AgoraRTM.createInstance(APP_ID);
                await client.login({ uid, token });

                channel = client.createChannel('main');
                await channel.join();

                channel.on('MemberJoined', handleUserJoined);
                channel.on('MemberLeft', handleUserLeft);
                client.on('MessageFromPeer', handleMessageFromPeer);

                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                document.getElementById('user1').srcObject = localStream;
            }
        } catch (error) {
            console.error('Error initializing video call:', error);
        }
    };

    let handleUserLeft = () => {
        document.getElementById('user2').style.display = 'none';
    };

    let handleMessageFromPeer = async (message, MemberId) => {
        const parsed = JSON.parse(message.text);
        if (parsed.type === 'offer') {
            createAnswer(MemberId, parsed.offer);
        } else if (parsed.type === 'answer') {
            addAnswer(parsed.answer);
        } else if (parsed.type === 'candidate') {
            if (peerConnection) {
                peerConnection.addIceCandidate(parsed.candidate);
            }
        }
    };

    let handleUserJoined = async (MemberId) => {
        alert('Another user has joined the channel');
        createOffer(MemberId);
    };

    let createPeerConnection = async (MemberId) => {
        peerConnection = new RTCPeerConnection(servers);
        remoteStream = new MediaStream();
        document.getElementById('user2').srcObject = remoteStream;
        document.getElementById('user2').style.display = 'block';

        if (!localStream) {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            document.getElementById('user1').srcObject = localStream;
        }

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
        };

        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                client.sendMessageToPeer(
                    { text: JSON.stringify({ type: 'candidate', candidate: event.candidate }) },
                    MemberId
                );
            }
        };
    };

    let createOffer = async (MemberId) => {
        await createPeerConnection(MemberId);
        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        client.sendMessageToPeer({ text: JSON.stringify({ type: 'offer', offer }) }, MemberId);
    };

    let createAnswer = async (MemberId, offer) => {
        await createPeerConnection(MemberId);
        await peerConnection.setRemoteDescription(offer);
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        client.sendMessageToPeer({ text: JSON.stringify({ type: 'answer', answer }) }, MemberId);
    };

    let addAnswer = async (answer) => {
        if (!peerConnection.currentRemoteDescription) {
            await peerConnection.setRemoteDescription(answer);
        }
    };

    let leaveChannel = async () => {
        if (channel) await channel.leave();
        if (client) await client.logout();
    };

    useEffect(() => {
        init();
        window.addEventListener('beforeunload', leaveChannel);
        return () => {
            leaveChannel();
        };
    }, []);

    return (
        <div>
            <div id="videos">
                <video className="video-player" id="user1" autoPlay playsInline></video>
                <video className="video-player" id="user2" autoPlay playsInline></video>
            </div>
        </div>
    );
};

export default VideoCall;
