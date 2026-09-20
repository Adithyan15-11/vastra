import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, X, RefreshCw, AlertTriangle, Check, FlipHorizontal, Crop } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, shouldCrop?: boolean) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setPermissionError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera permission was denied. Please allow camera access in your browser address bar settings or try uploading an image directly.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No camera device was detected on your system. You can still test with the offline demo samples or upload an image.');
      } else {
        setPermissionError(`Unable to start camera stream (${err.message || 'Unknown error'}). Try uploading an image file instead.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const handleCaptureAndCrop = () => {
    const dataUrl = captureFrame();
    if (!dataUrl) return;
    stopCamera();
    onCapture(dataUrl, true);
    onClose();
  };

  const handleCaptureDirect = () => {
    const dataUrl = captureFrame();
    if (!dataUrl) return;
    stopCamera();
    onCapture(dataUrl, false);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Live Textile Scanner</h3>
              <p className="text-xs text-slate-400">Position clothing inside the target reticle</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {permissionError ? (
            <div className="p-6 text-center max-w-md">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1.5">Camera Access Required</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{permissionError}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Camera Authorization
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-8 border border-indigo-500/30 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs border border-slate-700/60 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE HUD: 640×480 TENSOR</span>
              </div>
            </>
          )}
        </div>

        {/* Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            type="button"
            onClick={toggleFacingMode}
            disabled={!!permissionError || isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 rounded-xl transition-colors"
          >
            <FlipHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Flip ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCaptureAndCrop}
              disabled={!!permissionError || isLoading || !stream}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all active:scale-95"
              title="Crop snapshot before running neural recognition"
            >
              <Crop className="w-4 h-4 text-indigo-400" />
              <span>Capture & Crop</span>
            </button>

            <button
              type="button"
              onClick={handleCaptureDirect}
              disabled={!!permissionError || isLoading || !stream}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-900/30 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Capture & Analyze</span>
            </button>
          </div>
        </div>
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
