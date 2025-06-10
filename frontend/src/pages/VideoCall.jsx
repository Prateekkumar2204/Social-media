import React, { useEffect } from 'react';
import "../Scss/VideoCall.scss";
import { useAuth } from '../store/Auth';

const VideoCall = () => {
    // const { token, setUser, user, socket } = useAuth()

    let APP_ID = "9e5d7033251d4266813c1b19470cd898"
    let uid = String(Math.floor(Math.random() * 10000))
    let token = null

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
    }

    let isInitialized = false; // Add this variable to track initialization

    let init = async () => {
        try {
            if (!isInitialized) { // Check if not already initialized
                isInitialized = true; // Set to true to prevent reinitialization

                client = AgoraRTM.createInstance(APP_ID); // Create Agora RTM instance
                await client.login({ uid, token }); // Login using user ID and token

                channel = client.createChannel('main');
                await channel.join();

                channel.on('MemberJoined', handleUserJoined);
                channel.on('MemberLeft', handleUserLeft)
                client.on('MessageFromPeer', handleMessageFromPeer);
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                document.getElementById('user1').srcObject = localStream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    let handleUserLeft = (MemberId) => {
        document.getElementById('user-2').style.display = 'none'
    }
    let handleMessageFromPeer = async (message, MemberId) => {
        message = JSON.parse(message.text)
        if (message.type === 'offer') {
            createAnswer(MemberId, message.offer)
        }
        if (message.type === 'answer') {
            addAnswer(message.answer)
        }
        if (message.type === 'candidate') {
            if (peerConnection) {
                peerConnection.addIceCandidate(message.candidate)
            }
        }
        console.log('Message:', message.text)
    }

    let handleUserJoined = async (MemberId) => {
        console.log('A new user joined the channel: ', MemberId);
        // Display a message indicating that another user has joined
        alert('Another user has joined the channel');
        createOffer(MemberId);
    }
    let createPeerConnection = async (MemberId) => {
        peerConnection = new RTCPeerConnection(servers);

        remoteStream = new MediaStream();
        document.getElementById('user2').srcObject = remoteStream; // Corrected typo
        document.getElementById('user2').style.display = 'block' // Corrected typo

        if (!localStream) {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            document.getElementById('user1').srcObject = localStream;
        }
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'candidate', 'candidate': event.candidate }) }, MemberId)
            }
        };
    }
    let createOffer = async (MemberId) => {
        await createPeerConnection(MemberId)

        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log(offer);
        client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'offer', 'offer': offer }) }, MemberId)
    }
    let createAnswer = async (MemberId, offer) => {
        await createPeerConnection(MemberId)
        await peerConnection.setRemoteDescription(offer)
        let answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'answer', 'answer': answer }) }, MemberId)


    }

    let addAnswer = async (answer) => {
        if (!peerConnection.currentRemoteDescription) {
            peerConnection.setRemoteDescription(answer)
        }
    }

    let leaveChannel = async () => {
        await channel.leave()
        await client.logout()
    }

    window.addEventListener('beforeunload', leaveChannel)
    useEffect(() => {
        init();
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
