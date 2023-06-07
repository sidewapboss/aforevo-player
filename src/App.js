import React, { useState, useRef } from 'react'
import './App.css';
import PlayerControls from './component/PlayerControls'
import { makeStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player';
import screenfull from 'screenfull'

const useStyles = makeStyles({
  playerWrapper: {
      width: '100%',
      position: 'relative'
  },
})

const format = (seconds) => {
  if(isNaN(seconds)){
      return '00:00';
  }
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds().toString().padStart(2, "0")
  if(hh){
      return `${hh}:${mm.toString().padStart(2,"0")}:${ss}`;
  }
  return `${mm}:${ss}`;
}

let count = 0;

const AforevoPlayer = ({url, title}) => {
  const classes = useStyles();
    const [ post, setPost ] = useState([]);
    const [ loading, setLoading ] = useState(false)
    const [ isPlaying, setPlaying ] = useState(true)
    const [ muted, setMuted ] = useState(false)
    const [ volume, setVolume ] = useState(1)
    const [ playbackRate, setPlaybackRate ] = useState(1.0)
    const [ seeking, setSeeking ] = useState(false)
    const [ played, setPlayed ] = useState(0)
    const [ timeDisplayFormat, setTimeDisplayFormat ] = useState('normal')
    
    const playerRef = useRef(null)
    const playerContainerRef = useRef(null)
    const controlsRef = useRef(null)
    const handlePlayPause = () => {
        setPlaying(!isPlaying)
    }
    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }
    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
    }
    const handleMute = () => {
        setMuted(!muted)
        {!muted ? setVolume(0) : setVolume(1)}
    }
    const handleVolumeChange = (e, newValue) => {
        setVolume(parseFloat(newValue/100))
        setMuted(newValue === 0 ? true : false)
    }
    const handleVolumeSeek = (e, newValue) => {
        setVolume(parseFloat(newValue/100))
        setMuted(newValue === 0 ? true : false)
    }
    const handlePlaybackRateChage = (rate) => {
        setPlaybackRate(rate)
    }
    const handleToggleFullscreen = () => {
        screenfull.toggle(playerContainerRef.current)
    }
    const handleProgress = (changeState) => {
        if(count > 1){
            controlsRef.current.style.visibility = 'hidden'
            count = 0
        }
        if(controlsRef.current.style.visibility == 'visible'){
            count+=1
        }
        if(!seeking){
            setPlayed(changeState.played)
        }
    }
    const handleSeek = (e, newValue) => {
        setPlayed(parseFloat(newValue / 100))
    }
    const handleSeekDown = (e) => {
        setSeeking(true)
    }
    const handleSeekUp = (e, newValue) => {
        setSeeking(false)
        playerRef.current.seekTo(newValue / 100)
    }
    const handleChangeDisplay = () => {
        setTimeDisplayFormat(timeDisplayFormat === 'normal' ? 'remaining' : 'normal')
    }
    const handleMouseMove = () => {
        controlsRef.current.style.visibility = 'visible'
        count = 0
    }
    const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
    const duration = playerRef.current ? playerRef.current.getDuration() : '00:00';
    const elapsedTime = timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`
    const totalDuration = format(duration)
  return (
    <div className="App">
      <div
        ref={playerContainerRef}
        className={classes.playerWrapper}
        onMouseMove={handleMouseMove}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          muted={false}
          width={"100%"}
          height={"100%"}
          volume={volume}
          playbackRate={playbackRate}
          onProgress={handleProgress}
        />
        <PlayerControls
          ref={controlsRef}
          data={title}
          onPlayPause={handlePlayPause}
          playing={isPlaying}
          onRewind={handleRewind}
          onFastForward={handleFastForward}
          muted={muted}
          onMute={handleMute}
          onVolumeChange={handleVolumeChange}
          onVolumeSeek={handleVolumeSeek}
          volume={volume}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRateChage}
          onToggleFullscreen={handleToggleFullscreen}
          played={played}
          onSeek={handleSeek}
          onSeekMouseDown={handleSeekDown}
          onSeekMouseUp={handleSeekUp}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onChangeDisplayFormat={handleChangeDisplay}
        />
      </div>
    </div>
  );
}

export default AforevoPlayer;
