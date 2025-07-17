import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';  
import ROSLIB from 'roslib';

function App1() {
  const imgRef = useRef(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const [ros, setRos] = useState(null);
  const [angle, setAngle] = useState(180);

  const [brightness, setBrightness] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://10.42.0.1:9090' });
        
        ros.on('connection', () => {
          console.log("Connected to ROS Bridge");
          setIsConnected(true);
        });
        
        ros.on('error', (error) => {
          console.error("ROS Error:", error);
          setIsConnected(false);
        });
        
        ros.on('close', () => {
          console.log("ROS connection closed");
          setIsConnected(false);
        });

    const imageTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/pioneer_max_camera/image_raw/compressed', 
      messageType: 'sensor_msgs/CompressedImagex'
    });
    imageTopic.subscribe(message => {
      if (!imgRef.current) return;
      const base64Data = message.data;
      let mimeType;
      switch (message.format.toLowerCase()) {
        case 'jpeg': 
        case 'jpg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        default:
          console.warn('Unknown format:', message.format);
          mimeType = 'image/jpeg'; // Фолбэк
      }
      imgRef.current.src = `data:${mimeType};base64,${base64Data}`;
    });
    setRos(ros);
    
    return () => {
      ros.close();
    };
  },[]);
  const sendServoAngle = (angleValue) => {
      if (!ros) return;
        const topic = new ROSLIB.Topic({
        ros: ros,
        name: '/servo',
        messageType: 'std_msgs/String'
      });
      topic.publish(new ROSLIB.Message({ data: String(angleValue) }));
    };
  const handleAngleChange = (newAngle) => {
    setAngle(newAngle);
    sendServoAngle(newAngle);
  };

  const sendBrightness = (value) => {
      if (!ros || !isConnected) {
        console.warn("ROS not connected");
        return;
      }
  
      try {
        const service = new ROSLIB.Service({
          ros: ros,
          name: '/geoscan/led/module/set',
          serviceType: 'geoscan_msgs/Led'
        });
  
        const request = new ROSLIB.ServiceRequest({
          leds: Array(64).fill({  
            r: value,
            g: value,
            b: value,
            a: 255
          })
        });
  
        service.callService(request, (response) => {
          console.log("Service response:", response);
        });
      } catch (error) {
        console.error("Service call failed:", error);
      }
    };
  
    const handleBrightnessChange = (e) => {
      const value = Number(e.target.value);
      setBrightness(value);
      sendBrightness(value);
    };
  return (
    <>
  <meta charSet="UTF-8" />
  <title>Camera Control UI</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n    /* ----------  Global reset  ---------- */\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n\n    body {\n      font-family: \'Arial\', sans-serif;\n      background: #121212;\n      color: #ffffff;\n      height: 100vh;\n      display: flex;\n      flex-direction: column;\n    }\n\n    /* ----------  Top bar  ---------- */\n    #top-bar {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      background: #1a1a1a;\n      height: 48px;\n      padding: 0 16px;\n      user-select: none;\n      border-bottom: 1px solid #333;\n    }\n\n    #tabs {\n      display: inline-flex;\n      gap: 8px;\n    }\n\n    .tab {\n      padding: 8px 16px;\n      background: transparent;\n      color: #aaa;\n      cursor: pointer;\n      font-weight: 500;\n      font-size: 14px;\n      transition: all 0.2s ease;\n      border-radius: 4px;\n    }\n\n    .tab:hover {\n      background: #333;\n    }\n\n    .tab.active {\n      color: #fff;\n      background: #333;\n    }\n\n    /* Battery indicator */\n    #battery {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      cursor: pointer;\n      font-size: 14px;\n    }\n\n    .battery-box {\n      width: 36px;\n      height: 16px;\n      border: 1px solid #555;\n      position: relative;\n      border-radius: 2px;\n      overflow: hidden;\n    }\n\n    .battery-box::after {\n      content: "";\n      position: absolute;\n      right: -4px;\n      top: 3px;\n      width: 3px;\n      height: 6px;\n      background: #555;\n      border-radius: 1px;\n    }\n\n    .battery-level {\n      height: 100%;\n      width: 80%;\n      background: #4CAF50;\n    }\n\n    /* ----------  Main layout  ---------- */\n    #main {\n      display: flex;\n      flex: 1;\n      padding: 16px;\n      gap: 16px;\n      overflow: hidden;\n    }\n\n    /* Video / camera area */\n    #viewer-wrapper {\n      flex: 1;\n      background: #000;\n      position: relative;\n      overflow: hidden;\n      border-radius: 4px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    #video {\n      width: 100%;\n      height: 100%;\n      object-fit: contain;\n      background: #000;\n    }\n\n    /* Control pane */\n    #controls {\n      display: flex;\n      flex-direction: row;\n      align-items: flex-start;\n      gap: 24px;\n      padding: 0 8px;\n    }\n\n    .slider-container {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      color: #fff;\n      font-size: 14px;\n      width: 60px;\n    }\n\n    .slider-labels {\n      display: flex;\n      justify-content: space-between;\n      width: 100%;\n      margin: 4px 0;\n      font-size: 12px;\n      color: #aaa;\n    }\n\n    .slider-container label {\n      font-weight: 500;\n      margin-bottom: 8px;\n    }\n\n    .slider-value {\n      margin-top: 8px;\n      font-size: 12px;\n      color: #aaa;\n    }\n\n    /* Vertical range sliders */\n    /*input[type="range"].vertical {\n      -webkit-appearance: none;\n      width: 4px;\n      height: 120px;\n      background: #333;\n      border-radius: 2px;\n      outline: none;\n    }\n\n    input[type="range"].vertical::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      width: 12px;\n      height: 12px;\n      background: #fff;\n      border-radius: 50%;\n      cursor: pointer;\n    }\n\n    /* Footer with Height */\n    #footer {\n      padding: 8px 16px;\n      font-size: 12px;\n      color: #aaa;\n      background: #1a1a1a;\n      border-top: 1px solid #333;\n      display: flex;\n      justify-content: flex-end;\n    }\n  '
    }}
  />
  {/* =====  TOP BAR  ===== */}
  <div id="top-bar">
    <div id="tabs">
      <div className="tab active" data-tab="lan">
        LAN
      </div>
      <div className="tab" data-tab="analog">
        ANALOG
      </div>
    </div>
    <div
      id="battery"
      onclick="handleCameraSwitch()"
      title="Click to switch camera (stub)"
    >
      <span id="battery-text"> %</span>
      <div className="battery-box">
        <div className="battery-level" />
      </div>
    </div>
  </div>
  {/* =====  MAIN PANEL  ===== */}
  <div id="main">
    {/* Центральная область видео */}
    <div id="viewer-wrapper">
      <video id="video" autoPlay="" playsInline="" muted="" />
      <img 
        ref={imgRef} 
        style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      />
    </div>
      {/* Блок управления (CAM + LED) */}
    <div id="controls">
      {/* Слайдер CAM */}
      <div className="range-slider">
        <label htmlFor="cam-slider">CAM</label>
        <div className="slider-labels">
          <span>180</span>
        </div>
        <input
          orient="vertical"
          type="range"
          min="0"
          max="180"
          value={angle}
          onChange={(e) => handleAngleChange(parseInt(e.target.value))} 
          style={{ width: '100%' }}
        />
        <div className="slider-labels">
          <span>0</span>
        </div>
        <div>{angle}</div>
        <div id="footer">
          <div>Height: <span>  m </span> </div>
        </div>
      </div>
      <div className="range-slider">
        <label htmlFor="led-slider">LED</label>
        <div className="slider-labels">
          <span>255</span>
        </div>
        <input
          orient="vertical"
          type="range"
          min="0"
          max="255"
          value={brightness}
          onChange={handleBrightnessChange}
          style={{ width: '100%' }}
        />
        <div className="slider-labels">
          <span>0</span>
        </div>
        <div>{brightness}</div>
        <div id="footer">
          <div>Temp CPU: <span>  t </span> </div>
        </div>
      </div> 
    </div>
    {/* =====  FOOTER ===== */}
    
    {/* =====  SCRIPT  ===== */}
  </div>
</>
  );
}

export default App1;
