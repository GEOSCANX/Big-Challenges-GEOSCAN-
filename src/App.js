import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Slider from '@mui/material/Slider';
import axios from 'axios';

function App() {
  const [randomNumber, setRandomNumber] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/data', {
        user_text: text
      });
      setRandomNumber(response.data.random_number);
      setError(null);
    } catch (err) {
      setError(`Ошибка: ${err.message}`);
      console.error('Ошибка при запросе:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev <= 1 ? 60 : prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [text]);

  const [slider1, setSlider1] = useState(50);
  const [slider2, setSlider2] = useState(50);
  const [apiStatus, setApiStatus] = useState('');

  const handleSliderChange = async (sliderName, value) => {
    // Обновляем состояние сразу для плавного UI
    if (sliderName === 'slider1') {
      setSlider1(value);
    } else {
      setSlider2(value);
    }

    try {
      setApiStatus('Отправка...');
      const response = await axios.post('http://localhost:8000/api/sliders', {
        slider_name: sliderName, 
        value: parseInt(value)
      });
      setApiStatus(`Успешно: ${response.data.message}`);
    } catch (error) {
      setApiStatus(`Ошибка: ${error.message}`);
      console.error('Ошибка:', error.response?.data || error.message);
    }
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
      <span id="battery-text">{randomNumber} %</span>
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
    </div>
    {/* Блок управления (CAM + LED) */}
    <div id="controls">
      {/* Слайдер CAM */}
      <div className="range-slider">
        <label htmlFor="cam-slider">CAM</label>
        <div className="slider-labels">
          <span>+90</span>
        </div>
        <input
          orient="vertical"
          type="range"
          min="-90"
          max="90"
          value={slider1}
          onChange={(e) => handleSliderChange('slider1', e.target.value)}
          style={{ width: '100%' }}
        />
        <div className="slider-labels">
          <span>-90</span>
        </div>
        <div>{slider1}</div>
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
          value={slider2}
          onChange={(e) => handleSliderChange('slider2', e.target.value)}
          style={{ width: '100%' }}
        />
        <div className="slider-labels">
          <span>0</span>
        </div>
        <div>{slider2}</div>
      </div>
    </div>
    {/* =====  FOOTER ===== */}
    <div id="footer">
      Height: <span id="height-value">1.85 m</span>
    </div>
    {/* =====  SCRIPT  ===== */}
  </div>
</>

  );
}

export default App;