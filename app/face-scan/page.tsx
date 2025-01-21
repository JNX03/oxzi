"use client";
import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/*
  -----------------------
  Utility / Helper Functions
  -----------------------
*/

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[]): number {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((acc, val) => acc + (val - m) ** 2, 0) / arr.length);
}

function movingAverage(data: number[], windowSize = 3): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    result.push(mean(subset));
  }
  return result;
}

function hannWindow(data: number[]): number[] {
  // Apply a Hann (Hanning) window to reduce spectral leakage in FFT
  const n = data.length;
  return data.map((val, i) => {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    return val * w;
  });
}

function butterBandpass(lowcut: number, highcut: number, fs: number, order = 4) {
  // Simple FIR design using difference of sines approach
  // For more advanced filtering, consider IIR or a well-tested DSP library
  const nyq = 0.5 * fs;
  const low = lowcut / nyq;
  const high = highcut / nyq;
  const n = order * 2 + 1;
  const coeffs = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const x = i - order;
    if (x === 0) {
      coeffs[i] = 2 * (high - low);
    } else {
      coeffs[i] =
        (Math.sin(2 * Math.PI * high * x) -
          Math.sin(2 * Math.PI * low * x)) /
        (Math.PI * x);
    }
  }

  // Normalize
  const sum = coeffs.reduce((a, b) => a + b, 0);
  return coeffs.map((c) => c / sum);
}

function bandpassFilter(
  data: number[],
  lowcut: number,
  highcut: number,
  fs: number,
  order = 4
): number[] {
  const coeffs = butterBandpass(lowcut, highcut, fs, order);
  const filtered: number[] = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < coeffs.length; j++) {
      const idx = i - j;
      if (idx >= 0) {
        sum += coeffs[j] * data[idx];
      }
    }
    filtered.push(sum);
  }
  return filtered;
}

// Basic in-place FFT (radix-2)
function fft(re: number[], im: number[]): void {
  const n = re.length;
  if (n <= 1) return;

  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >>> 1;
    const theta = (2 * Math.PI) / len;
    const wpr = Math.cos(theta);
    const wpi = -Math.sin(theta);

    for (let start = 0; start < n; start += len) {
      let wr = 1;
      let wi = 0;
      for (let i = 0; i < halfLen; i++) {
        const i1 = start + i;
        const i2 = i1 + halfLen;
        const tr = wr * re[i2] - wi * im[i2];
        const ti = wr * im[i2] + wi * re[i2];
        re[i2] = re[i1] - tr;
        im[i2] = im[i1] - ti;
        re[i1] += tr;
        im[i1] += ti;

        const wtemp = wr;
        wr = wtemp * wpr - wi * wpi;
        wi = wtemp * wpi + wi * wpr;
      }
    }
  }
}

/**
 * calculateHRFromFFT:
 * - Optionally apply Hann window
 * - FFT
 * - Find dominant frequency in band [lowcut, highcut]
 * - Return BPM
 */
function calculateHRFromFFT(
  data: number[],
  fs: number,
  lowcut = 0.7,
  highcut = 3.0,
  applyHann = true
): number {
  const N = data.length;
  // Optionally apply Hann window to reduce spectral leakage
  const windowed = applyHann ? hannWindow(data) : data;

  // Prepare arrays for FFT
  const re = [...windowed];
  const im = new Array(N).fill(0);

  fft(re, im);

  let maxAmp = -Infinity;
  let dominantFreq = 0;

  for (let i = 0; i < N / 2; i++) {
    const freq = (i * fs) / N;
    if (freq >= lowcut && freq <= highcut) {
      const magnitude = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
      if (magnitude > maxAmp) {
        maxAmp = magnitude;
        dominantFreq = freq;
      }
    }
  }

  return dominantFreq * 60;
}

/**
 * estimateHeartRateAI:
 * - Placeholder function for integrating a more advanced ML-based approach.
 * - For now, it calls calculateHRFromFFT. 
 * - You could replace this with a call to a deep-learning–based rPPG model.
 */
function estimateHeartRateAI(
  data: number[],
  fs: number,
  lowcut = 0.7,
  highcut = 3.0
): number {
  // Example uses the FFT approach internally.
  // Replace/extend with advanced ML-based logic if desired:
  return calculateHRFromFFT(data, fs, lowcut, highcut, true);
}

function calculateSpO2(red: number[], green: number[]): number {
  const redAC = std(red);
  const redDC = mean(red);
  const greenAC = std(green);
  const greenDC = mean(green);
  const R = (redAC / redDC) / (greenAC / greenDC);
  // Slightly tweak formula
  const spo2Approx = 110 - 25 * R;
  return Math.round(Math.max(80, Math.min(100, spo2Approx)));
}

function calculateStressLevel(heartRate: number, hrv: number): number {
  // This is a naive formula. Real stress computations might factor in more signals.
  const normalizedHR = (heartRate - 60) / 40; // e.g. 60 -> 0, 100 -> 1
  const normalizedHRV = (hrv - 20) / 40;     // rough scale for HRV
  const stress = (normalizedHR + (1 - normalizedHRV)) / 2;
  return Math.round(Math.max(0, Math.min(100, stress * 100)));
}

/*
  -----------------------
  Main Component
  -----------------------
*/
export default function FaceScan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real-time measurements
  const [measurements, setMeasurements] = useState({
    heartRate: 0,
    spo2: 0,
    stressLevel: 0,
  });

  // Rolling average for displayed measurement
  const rollingHR: number[] = [];
  const rollingSpO2: number[] = [];
  const rollingStress: number[] = [];

  // Errors and initialization
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Buffers (larger buffer -> more stable readings)
  const bufferSize = 900; // 30 seconds at 30fps
  const greenBufferRef = useRef<number[]>([]);
  const redBufferRef = useRef<number[]>([]);
  const blueBufferRef = useRef<number[]>([]);

  // Graph data: We'll store rawGreen, rawRed, rawBlue
  const [graphData, setGraphData] = useState<
    { time: number; rawGreen: number; rawRed: number; rawBlue: number }[]
  >([]);

  // Sampling frequency
  const fs = 30;
  // Bandpass range in Hz for typical heart rate
  const lowcut = 0.7;
  const highcut = 3.0;

  // For motion check
  const [previousLandmarks, setPreviousLandmarks] = useState<faceapi.Point[]>([]);

  // Load face-api.js models
  useEffect(() => {
    async function loadModels() {
      try {
        /**
         * Make sure your "public/models" folder contains:
         *  - tiny_face_detector_model-weights_manifest.json
         *  - tiny_face_detector_model-shard1
         *  - face_landmark_68_model-weights_manifest.json
         *  - face_landmark_68_model-shard1
         */
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (e) {
        console.error("Failed to load face-api models:", e);
        setError(
          "Failed to load face-api models. Ensure model files are in '/public/models'."
        );
      }
    }
    loadModels();
  }, []);

  // Access camera
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setError("Unable to access the camera. Please check your permissions.");
        });
    }
  }, []);

  // Let user get ready (e.g., 5 seconds) before analyzing to reduce noise
  useEffect(() => {
    const timer = setTimeout(() => setInitializing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Extract forehead ROI using face landmarks:
   * - The region above eyebrows in a rectangle shape
   */
  function getForeheadRegion(landmarks: faceapi.FaceLandmarks68) {
    // Points for eyebrows are around indices [17..26] or [22..27] in 68-landmark scheme
    // Let's gather the average x,y of upper eyebrows to get an approximate bounding box
    const leftEyebrow = landmarks.getLeftEyeBrow();
    const rightEyebrow = landmarks.getRightEyeBrow();

    // Combine eyebrows to find bounding box
    const allBrowPoints = [...leftEyebrow, ...rightEyebrow];
    const minX = Math.min(...allBrowPoints.map((p) => p.x));
    const maxX = Math.max(...allBrowPoints.map((p) => p.x));
    const minY = Math.min(...allBrowPoints.map((p) => p.y));
    const maxY = Math.max(...allBrowPoints.map((p) => p.y));

    // Define a rectangle above eyebrows: let's keep it 20% of face height tall
    // Or, we can do a smaller rectangle for just above the eyebrows
    const faceHeight = landmarks.getJawOutline()[16].y - landmarks.getJawOutline()[0].y;
    const regionHeight = faceHeight * 0.15; // 15% of face height

    return {
      x: minX,
      y: minY - regionHeight * 0.5, // push it up a bit above eyebrows
      width: maxX - minX,
      height: regionHeight,
    };
  }

  /**
   * Compute a simple motion score based on the sum of distances
   * between consecutive frame landmarks.
   */
  function computeMotionScore(
    oldPoints: faceapi.Point[],
    newPoints: faceapi.Point[]
  ): number {
    if (oldPoints.length !== newPoints.length) return 9999; // large if mismatch
    let sumDist = 0;
    for (let i = 0; i < oldPoints.length; i++) {
      const dx = oldPoints[i].x - newPoints[i].x;
      const dy = oldPoints[i].y - newPoints[i].y;
      sumDist += Math.sqrt(dx * dx + dy * dy);
    }
    return sumDist / oldPoints.length;
  }

  // Process each video frame: detect face, extract forehead ROI, measure R/G/B
  async function processFrame() {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use face detection + landmarks
    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection || !detection.landmarks) {
      return;
    }

    const landmarks = detection.landmarks;
    const foreheadBox = getForeheadRegion(landmarks);

    // Motion check
    const newPoints = landmarks.positions;
    if (previousLandmarks.length > 0) {
      const motionScore = computeMotionScore(previousLandmarks, newPoints);
      // If motion is too high, skip this frame to reduce artifacts
      if (motionScore > 3.0) {
        setPreviousLandmarks(newPoints);
        return;
      }
    }
    setPreviousLandmarks(newPoints);

    // Extract forehead ROI
    const imageData = ctx.getImageData(
      foreheadBox.x,
      foreheadBox.y,
      foreheadBox.width,
      foreheadBox.height
    );

    let totalGreen = 0;
    let totalRed = 0;
    let totalBlue = 0;
    let pixelCount = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      totalRed += r;
      totalGreen += g;
      totalBlue += b;
      pixelCount++;
    }

    const avgRed = totalRed / pixelCount;
    const avgGreen = totalGreen / pixelCount;
    const avgBlue = totalBlue / pixelCount;

    redBufferRef.current.push(avgRed);
    greenBufferRef.current.push(avgGreen);
    blueBufferRef.current.push(avgBlue);

    if (redBufferRef.current.length > bufferSize) redBufferRef.current.shift();
    if (greenBufferRef.current.length > bufferSize) greenBufferRef.current.shift();
    if (blueBufferRef.current.length > bufferSize) blueBufferRef.current.shift();

    setGraphData((prev) => {
      const timeIndex = prev.length ? prev[prev.length - 1].time + 1 : 0;
      const newData = [
        ...prev,
        { time: timeIndex, rawGreen: avgGreen, rawRed: avgRed, rawBlue: avgBlue },
      ];
      return newData.slice(-bufferSize);
    });
  }

  // Analyze the signal once per second (not every frame)
  function analyzeSignal() {
    if (initializing) return; // Skip if still in "initializing" period

    const greenData = [...greenBufferRef.current];
    const redData = [...redBufferRef.current];

    // We need enough data to compute stable results
    if (greenData.length < fs * 10) {
      // Wait until we have at least ~10s of data for a better reading
      return;
    }

    // Smooth raw data
    const smoothedGreen = movingAverage(greenData, 3);

    // Bandpass filter
    const filteredGreen = bandpassFilter(smoothedGreen, lowcut, highcut, fs);

    // Calculate heart rate (AI placeholder)
    const heartRate = estimateHeartRateAI(filteredGreen, fs, lowcut, highcut);

    // Time-domain approach to get intervals for HRV (peak detection)
    const intervals: number[] = [];
    let lastPeak = -1;
    for (let i = 1; i < filteredGreen.length - 1; i++) {
      if (
        filteredGreen[i] > filteredGreen[i - 1] &&
        filteredGreen[i] > filteredGreen[i + 1]
      ) {
        if (lastPeak >= 0) {
          intervals.push((i - lastPeak) / fs);
        }
        lastPeak = i;
      }
    }

    let hrv = 0;
    if (intervals.length > 1) {
      hrv = std(intervals) * 1000; // standard deviation of intervals in ms
    }

    // Approximate SpO2 from Red vs Green
    const spo2 = calculateSpO2(redData, greenData);

    // Approximate stress level
    const stressLevel = calculateStressLevel(heartRate, hrv);

    // Keep a short rolling average to smooth out flicker
    rollingHR.push(heartRate);
    rollingSpO2.push(spo2);
    rollingStress.push(stressLevel);

    if (rollingHR.length > 5) rollingHR.shift();
    if (rollingSpO2.length > 5) rollingSpO2.shift();
    if (rollingStress.length > 5) rollingStress.shift();

    const finalHR = Math.round(mean(rollingHR));
    const finalSpO2 = Math.round(mean(rollingSpO2));
    const finalStress = Math.round(mean(rollingStress));

    setMeasurements({
      heartRate: finalHR,
      spo2: finalSpO2,
      stressLevel: finalStress,
    });
  }

  // Periodically grab frames
  useEffect(() => {
    const frameInterval = setInterval(processFrame, 1000 / fs);
    return () => clearInterval(frameInterval);
  }, [fs, modelsLoaded]);

  // Periodically analyze signals
  useEffect(() => {
    const analysisInterval = setInterval(analyzeSignal, 1000);
    return () => clearInterval(analysisInterval);
  }, [initializing]);

  return (
    <Layout>
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-3xl font-bold">
          Face Scan - Multi-Channel Visualization
        </h1>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <Card className="w-full md:w-[350px]">
            <CardHeader>
              <CardTitle>Camera Feed</CardTitle>
              <CardDescription>Align your forehead in the frame</CardDescription>
            </CardHeader>
            <CardContent>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
              />
              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                width="640"
                height="480"
              />
            </CardContent>
          </Card>

          <Card className="w-full md:w-[350px]">
            <CardHeader>
              <CardTitle>Measurements</CardTitle>
              <CardDescription>Real-time (approx.) vitals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Heart Rate</p>
                  <p className="text-2xl font-bold">
                    {measurements.heartRate} BPM
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">SpO2</p>
                  <p className="text-2xl font-bold">{measurements.spo2}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Stress Level</p>
                  <p className="text-2xl font-bold">
                    {measurements.stressLevel}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Signal Visualization</CardTitle>
            <CardDescription>
              Raw Red / Green / Blue Intensities (Forehead ROI)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rawGreen"
                    stroke="#22c55e" // green
                    name="Green"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rawRed"
                    stroke="#ef4444" // red
                    name="Red"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rawBlue"
                    stroke="#3b82f6" // blue
                    name="Blue"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Optional disclaimers */}
        <p className="max-w-xl text-center text-sm text-gray-600">
          This application uses a standard webcam to estimate vitals. 
          Results may not match medical-grade devices. Ensure good lighting 
          and minimal movement for the best results.
        </p>
      </div>
    </Layout>
  );
}
