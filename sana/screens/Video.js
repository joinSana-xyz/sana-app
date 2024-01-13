import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  createCameraVideoTrack,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "../src/api";
import ReactPlayer from "react-player";
import {useRoute } from "@react-navigation/native";
import {auth, database} from '../config/firebase';
import '../styles/video.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash ,faPhoneSlash,faUpRightFromSquare  } from '@fortawesome/free-solid-svg-icons'
//icons

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, screenShareOn, screenShareStream, screenShareAudioStream } = useParticipant(props.participantId);
  const audioPlayer = useRef();

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]); 

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);
  useEffect(() => {
    if (
      !isLocal &&
      audioPlayer.current &&
      screenShareOn &&
      screenShareAudioStream
    ) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareAudioStream.track);

      audioPlayer.current.srcObject = mediaStream;
      audioPlayer.current.play().catch((err) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      //audioPlayer.current.srcObject = null;
      console.log('okay');
    }
  }, [screenShareAudioStream, screenShareOn, isLocal]);

  return (
    <div key={props.participantId}>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay muted={isLocal} />      
      {!webcamOn && !screenShareOn && (
        <div className="nameIcon">
          <div>
            {displayName}
          </div>
        </div>
      )}
      {webcamOn && !screenShareOn &&(
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          width="100%"
          height="100%"
          //
          url={videoStream}
          //
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}

      {screenShareOn &&(
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          width="100%"
          height="100%"
          //
          url={mediaStream}
          //
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { localMicOn, localWebcamOn, leave, toggleMic, toggleWebcam, getMics, changeMic, getWebcams, changeWebcam,  enableScreenShare, disableScreenShare, toggleScreenShare   } = useMeeting();
  const [mics, setMics] = useState([]);
  const [selectedMic, setSelectedMic] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const pipWindowRef = useRef();
  

  //Getting the methods to change and get the microphone

  //Method to get the mics and load in our state
  const handleGetMics = async () => {
    const mics = await getMics();
    setMics(mics);
  };
  const handleGetWebcams = async () => {
    const webcams = await getWebcams();
    setCameras(webcams);
  };
  const handleToggleWebcam = async () => {
    if (localWebcamOn) {
      toggleWebcam();
    } else {
      let customTrack = await createCameraVideoTrack({
        optimizationMode: "motion",
        encoderConfig: "h720p_w960p",
        facingMode: "environment",
        multiStream: false,
      });

      toggleWebcam(customTrack);
    }
  };
  const getRowCount = (length) => {
    return length > 2 ? 2 : length > 0 ? 1 : 0;
  };
  const getColCount = (length) => {
    return length < 2 ? 1 : length < 5 ? 2 : 3;
  };
  const togglePipMode = async () => {
    if (pipWindowRef.current) {
      await document.exitPictureInPicture();
      pipWindowRef.current = null;
      return;
    }
    //Check if browser supports PiP mode else show a message to user
    if ("pictureInPictureEnabled" in document) {
      const source = document.createElement("canvas");
      const ctx = source.getContext("2d");

      //Create a Video tag which we will popout for PiP
      const pipVideo = document.createElement("video");
      pipWindowRef.current = pipVideo;
      pipVideo.autoplay = true;

      //Creating stream from canvas which we will play
      const stream = source.captureStream();
      pipVideo.srcObject = stream;

      //Do initial Canvas Paint
      drawCanvas()

      //When Video is ready we will start PiP mode
      pipVideo.onloadedmetadata = () => {
        pipVideo.requestPictureInPicture();
      };
      await pipVideo.play();

      //When the PiP mode starts, we will start drawing canvas with PiP view
      pipVideo.addEventListener("enterpictureinpicture", (event) => {
        drawCanvas();
      });

      //When PiP mode exits, we will dispose the track we created earlier
      pipVideo.addEventListener("leavepictureinpicture", (event) => {
        pipWindowRef.current = null;
        pipVideo.srcObject.getTracks().forEach((track) => track.stop());
      });

      //This will draw all the video elements in to the Canvas
      function drawCanvas() {
        //Getting all the video elements in the document
        const videos = document.querySelectorAll("video");
        console.log(videos)
        try {
          //Perform initial black paint on the canvas
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, source.width, source.height);

          //Drawing the participant videos on the canvas in the grid format
          const rows = getRowCount(videos.length);
          const columns = getColCount(videos.length);
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
              if (j + i * columns <= videos.length || videos.length == 1) {
                ctx.drawImage(
                  videos[j + i * columns],
                  j < 1 ? 0 : source.width / (columns / j),
                  i < 1 ? 0 : source.height / (rows / i),
                  source.width / columns,
                  source.height / rows
                );
              }
            }
          }
        } catch (error) {}

        //If pip mode is on, keep drawing the canvas when ever new frame is requested
        if (document.pictureInPictureElement === pipVideo) {
          requestAnimationFrame(drawCanvas);
        }
      }
    } else {
      alert("PiP is not supported by your browser");
    }
  };
  const handleEnableScreenShare = () => {
    // Enabling screen share
    enableScreenShare();
  };
  const handleDisableScreenShare = () => {
    // Disabling screen share
    disableScreenShare();
  };
  const handleToggleScreenShare = () => {
    // Toggling screen share
    toggleScreenShare();
  };
  useEffect(() => {
    handleGetMics();
  }, []);
  useEffect(() => {
    handleGetWebcams();
  }, []);
  const handleChangeMic = (event) => {
    changeMic(event.target.value);
    setSelectedMic(event.target.value);
  };
  const handleChangeCamera = (event) => {
    changeWebcam(event.target.value);
    setSelectedCamera(event.target.value);
  };
  return (
    <div className='control'>
      <button style={{ backgroundColor : 'red' }} className = 'icon' onClick={() => leave()}><FontAwesomeIcon icon={faPhoneSlash} /></button>
      <button style={localMicOn ? {backgroundColor: 'white', color: 'black'} : {backgroundColor: '#2f3136', color: 'white'} } className = 'icon' onClick={() => toggleMic()}><FontAwesomeIcon icon={localMicOn ? (faMicrophone) : (faMicrophoneSlash)} /></button>
      <button style={localWebcamOn ? {backgroundColor: 'white', color: 'black'} : {backgroundColor: '#2f3136', color: 'white'} } className = 'icon' onClick={handleToggleWebcam}><FontAwesomeIcon icon={localWebcamOn ? (faVideo) : (faVideoSlash)} /></button>
      <button className = 'icon' onClick={handleToggleScreenShare}><FontAwesomeIcon icon={faDisplay} /></button>
      <button className = 'icon' onClick={() => togglePipMode()}><FontAwesomeIcon icon={faUpRightFromSquare} /></button>
      <select value={selectedMic} onChange={handleChangeMic}>
        {mics.map((mic) => {
          return <option value={mic.deviceId}>{mic.label}</option>;
        })}
      </select>
      <select value={selectedCamera} onChange={handleChangeCamera}>
        {cameras.map((camera) => {
          return <option value={camera.deviceId}>{camera.label}</option>;
        })}
      </select>
      </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const { join } = useMeeting();
  const { participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div className="videoScreen">
          <Controls />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default function Video({navigation}) {
  const getTrack = async () => {
    const track = await createCameraVideoTrack({
      optimizationMode: "motion",
      encoderConfig: "h720p_w960p",
      facingMode: "environment",
    });
    setCustomTrack(track);
  };
  let [customTrack, setCustomTrack] = useState();
  useEffect(() => {
    getTrack();
  }, []);
  const [meetingId, setMeetingId] = useState(null);
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken, customId: "test" }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
    navigation.navigate("Contacts")
  };

  return authToken && meetingId && customTrack ? (
    <div className="largeBox">
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: auth.currentUser?.email,
        customCameraVideoTrack: customTrack,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
    </div>
  ) : (
    <div className="largeBox">
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    </div>
  );
}
