import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  convertVideoUrlToEmbedUrl,
  isGoogleDriveLink,
  isYouTubeLink,
} from "../utils/googleDrive";

function VideoPlayerSection({
  selectedModule,
  selectedVideo,
  onPreviousVideo,
  onNextVideo,
  onTrackedProgress,
  onVideoEnded,
  hasPreviousVideo,
  hasNextVideo,
}) {
  const videoRef = useRef(null);
  const sentMilestonesRef = useRef(new Set());
  const completionToastShownRef = useRef(false);
  const completionHandledRef = useRef(false);
  const nextCountdownIntervalRef = useRef(null);
  const lastSaveSecondRef = useRef(-1);
  const watchedSecondsRef = useRef(new Set());

  const [localProgress, setLocalProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [nextCountdown, setNextCountdown] = useState(0);
  const [isEligibleComplete, setIsEligibleComplete] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const rawVideoUrl = selectedVideo?.videoUrl || "";
  const embeddedVideoUrl = convertVideoUrlToEmbedUrl(rawVideoUrl);

  const isYouTubeVideo =
    isYouTubeLink(rawVideoUrl) || isYouTubeLink(embeddedVideoUrl);

  const isGoogleDriveVideo =
    isGoogleDriveLink(rawVideoUrl) || isGoogleDriveLink(embeddedVideoUrl);

  const isIframeVideo = isGoogleDriveVideo || isYouTubeVideo;
  const isDirectVideo = !isIframeVideo;

  const requiredWatchPercent = 80;
  const milestoneSteps = useMemo(() => [10, 25, 50, 80, 100], []);
  const segmentTargets = useMemo(() => [25, 50, 75, 100], []);
  const segmentCompletionThreshold = 0.65;

  const resumeStorageKey = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `internova_video_resume_${selectedVideo.id}`;
  }, [selectedVideo?.id]);

  const watchedStorageKey = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `internova_video_watched_${selectedVideo.id}`;
  }, [selectedVideo?.id]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2500);
  };

  const showCompletionToastOnce = () => {
    if (completionToastShownRef.current) return;
    completionToastShownRef.current = true;
    showToast(
      "success",
      `${selectedVideo?.title || "Video"} completed successfully`
    );
  };

  const clearNextCountdown = () => {
    if (nextCountdownIntervalRef.current) {
      clearInterval(nextCountdownIntervalRef.current);
      nextCountdownIntervalRef.current = null;
    }
    setNextCountdown(0);
  };

  const startNextCountdown = () => {
    if (!hasNextVideo || !onNextVideo) return;

    clearNextCountdown();
    setNextCountdown(3);

    let remaining = 3;
    nextCountdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setNextCountdown(remaining);

      if (remaining <= 0) {
        clearNextCountdown();
        onNextVideo();
      }
    }, 1000);
  };

  const saveResumePosition = (seconds) => {
    if (!resumeStorageKey || !Number.isFinite(seconds) || seconds < 0) return;

    try {
      localStorage.setItem(resumeStorageKey, String(Math.floor(seconds)));
    } catch (error) {
      console.error("Failed to save resume position:", error);
    }
  };

  const getSavedResumePosition = () => {
    if (!resumeStorageKey) return 0;

    try {
      const raw = localStorage.getItem(resumeStorageKey);
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch (error) {
      console.error("Failed to read resume position:", error);
      return 0;
    }
  };

  const clearResumePosition = () => {
    if (!resumeStorageKey) return;

    try {
      localStorage.removeItem(resumeStorageKey);
    } catch (error) {
      console.error("Failed to clear resume position:", error);
    }
  };

  const saveWatchedSeconds = () => {
    if (!watchedStorageKey) return;

    try {
      localStorage.setItem(
        watchedStorageKey,
        JSON.stringify([...watchedSecondsRef.current])
      );
    } catch (error) {
      console.error("Failed to save watched seconds:", error);
    }
  };

  const loadWatchedSeconds = () => {
    if (!watchedStorageKey) return new Set();

    try {
      const raw = localStorage.getItem(watchedStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return new Set();

      return new Set(
        parsed
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item) && item >= 0)
      );
    } catch (error) {
      console.error("Failed to load watched seconds:", error);
      return new Set();
    }
  };

  const clearWatchedSeconds = () => {
    if (!watchedStorageKey) return;

    try {
      localStorage.removeItem(watchedStorageKey);
    } catch (error) {
      console.error("Failed to clear watched seconds:", error);
    }
  };

  const formatDuration = (seconds = 0) => {
    const safe = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const secs = safe % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const getSegmentBasedProgress = (duration) => {
    if (!duration || duration <= 0) return 0;

    const totalSeconds = Math.ceil(duration);
    const segmentSize = totalSeconds / 4;
    let completedSegments = 0;

    for (let i = 0; i < 4; i += 1) {
      const start = Math.floor(i * segmentSize);
      const end =
        i === 3
          ? totalSeconds
          : Math.floor((i + 1) * segmentSize);

      const segmentLength = Math.max(1, end - start);
      let watchedInSegment = 0;

      for (let sec = start; sec < end; sec += 1) {
        if (watchedSecondsRef.current.has(sec)) {
          watchedInSegment += 1;
        }
      }

      const ratio = watchedInSegment / segmentLength;
      if (ratio >= segmentCompletionThreshold) {
        completedSegments += 1;
      }
    }

    return completedSegments * 25;
  };

  const pushTrackedMilestone = (percent) => {
    if (!selectedVideo || !onTrackedProgress) return;

    if (!sentMilestonesRef.current.has(percent)) {
      sentMilestonesRef.current.add(percent);
      onTrackedProgress(percent);
    }
  };

  const updateProgressState = (duration) => {
    const computedProgress = getSegmentBasedProgress(duration);
    const effectiveProgress = Math.max(
      selectedVideo?.watchedPercent || 0,
      computedProgress
    );

    setLocalProgress(effectiveProgress);
    setIsEligibleComplete(effectiveProgress >= requiredWatchPercent);

    milestoneSteps.forEach((step) => {
      if (effectiveProgress >= step) {
        pushTrackedMilestone(step);
      }
    });

    return effectiveProgress;
  };

  const handleCompletionFlow = () => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    clearNextCountdown();
    clearResumePosition();
    clearWatchedSeconds();
    setIsEligibleComplete(true);
    setLocalProgress(100);
    showCompletionToastOnce();

    if (onVideoEnded) {
      onVideoEnded();
    }

    if (hasNextVideo) {
      startNextCountdown();
    }
  };

  useEffect(() => {
    const restoredProgress = selectedVideo?.watchedPercent || 0;

    setLocalProgress(restoredProgress);
    setVideoDuration(0);
    setNextCountdown(0);
    setIsEligibleComplete(restoredProgress >= requiredWatchPercent);
    completionToastShownRef.current = false;
    completionHandledRef.current = false;
    sentMilestonesRef.current = new Set();
    lastSaveSecondRef.current = -1;
    watchedSecondsRef.current = new Set();
    clearNextCountdown();

    milestoneSteps.forEach((step) => {
      if (restoredProgress >= step) {
        sentMilestonesRef.current.add(step);
      }
    });

    return () => {
      clearNextCountdown();
    };
  }, [selectedVideo, milestoneSteps]);

  const syncRestoredState = (duration) => {
    if (!duration || duration <= 0) return;

    watchedSecondsRef.current = loadWatchedSeconds();

    const savedResumeTime = getSavedResumePosition();
    const safeResumeTime = Math.min(savedResumeTime, Math.max(0, duration - 2));

    if (videoRef.current && safeResumeTime > 0) {
      try {
        videoRef.current.currentTime = safeResumeTime;
      } catch (error) {
        console.error("Failed to restore playback time:", error);
      }
    }

    updateProgressState(duration);
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
    syncRestoredState(duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const current = video.currentTime;
    const flooredSecond = Math.floor(current);

    watchedSecondsRef.current.add(flooredSecond);

    if (flooredSecond !== lastSaveSecondRef.current) {
      lastSaveSecondRef.current = flooredSecond;
      saveResumePosition(current);
      saveWatchedSeconds();
    }

    updateProgressState(video.duration);
  };

  const handleEndedInternal = () => {
    const video = videoRef.current;
    const duration = video?.duration || videoDuration || 0;
    const effectiveProgress = updateProgressState(duration);

    if (effectiveProgress >= requiredWatchPercent) {
      pushTrackedMilestone(100);
      handleCompletionFlow();
    } else {
      showToast(
        "error",
        `Complete at least ${requiredWatchPercent}% required segments to finish this video`
      );
    }
  };

  const handlePreventContextMenu = (event) => {
    event.preventDefault();
  };

  const progressBarWidth = `${Math.min(100, Math.max(0, localProgress))}%`;

  if (!selectedModule || !selectedVideo) {
    return (
      <div className="video-player-card premium-video-card empty">
        <div className="video-empty-icon">▶</div>
        <h3>No video selected</h3>
        <p>
          Please choose an unlocked topic from the module list to start your
          learning session.
        </p>
      </div>
    );
  }

  return (
    <div className="video-player-card premium-video-card position-relative">
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "96px",
            right: "24px",
            zIndex: 99999,
            minWidth: "280px",
            maxWidth: "380px",
          }}
        >
          <div
            className="shadow-lg rounded-4 px-4 py-3"
            style={{
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                  : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              border:
                toast.type === "success"
                  ? "1px solid #86efac"
                  : "1px solid #fca5a5",
            }}
          >
            <div
              className={`fw-bold mb-1 ${
                toast.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </div>
            <div className="text-dark small">{toast.message}</div>
          </div>
        </div>
      )}

      <div
        style={{
          marginBottom: "18px",
          padding: "16px 18px",
          borderRadius: "22px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(148,163,184,0.20)",
          boxShadow: "0 12px 34px rgba(15,23,42,0.07)",
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 800,
                color: "#2563eb",
                marginBottom: "6px",
              }}
            >
              Smart Progress Tracking
            </div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Verified Segment Progress: {localProgress}%
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background: isEligibleComplete
                  ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                  : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                color: isEligibleComplete ? "#166534" : "#1d4ed8",
                border: isEligibleComplete
                  ? "1px solid #86efac"
                  : "1px solid #93c5fd",
                fontWeight: 800,
              }}
            >
              {isEligibleComplete ? "Completion Unlocked" : "Still Watching"}
            </span>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                color: "#334155",
                border: "1px solid #cbd5e1",
                fontWeight: 800,
              }}
            >
              4 Smart Segments
            </span>
          </div>
        </div>

        <div
          style={{
            height: "12px",
            width: "100%",
            borderRadius: "999px",
            background: "#e2e8f0",
            overflow: "hidden",
            boxShadow: "inset 0 1px 2px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              width: progressBarWidth,
              height: "100%",
              borderRadius: "999px",
              background:
                localProgress >= requiredWatchPercent
                  ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                  : "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
              transition: "width 0.35s ease",
            }}
          />
        </div>

        <div className="d-flex flex-wrap justify-content-between gap-3 mt-3">
          <small style={{ color: "#64748b", fontWeight: 700 }}>
            Mode: {isDirectVideo ? "Direct Video Verified Tracking" : "Embedded Playback"}
          </small>
          <small style={{ color: "#64748b", fontWeight: 700 }}>
            {videoDuration ? `Duration: ${formatDuration(videoDuration)}` : "Duration loading..."}
          </small>
        </div>
      </div>

      <div className="video-player-header premium-video-header">
        <div>
          <p className="video-player-module">{selectedModule.title}</p>
          <h3>{selectedVideo.title}</h3>
          <span>{selectedVideo.description}</span>
        </div>

        <div className="video-player-status premium-video-status">
          <span>
            {selectedVideo.duration ||
              (videoDuration ? formatDuration(videoDuration) : "Video")}
          </span>
          <strong>
            {isEligibleComplete ? "Completed" : `${localProgress}% Verified`}
          </strong>
        </div>
      </div>

      <div
        className="video-player-wrapper premium-video-wrapper"
        onContextMenu={handlePreventContextMenu}
      >
        {isIframeVideo ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "24px",
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <iframe
              key={selectedVideo.id}
              src={embeddedVideoUrl}
              title={selectedVideo.title || "Course Video"}
              className="internova-video-player"
              allow={
                isYouTubeVideo
                  ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  : "autoplay; fullscreen"
              }
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                width: "100%",
                height: "520px",
                border: "none",
                display: "block",
                borderRadius: "24px",
                background: "#000",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <video
              ref={videoRef}
              key={selectedVideo.id}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={handlePreventContextMenu}
              className="internova-video-player"
              src={rawVideoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEndedInternal}
              style={{
                width: "100%",
                display: "block",
                background: "#000",
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <div className="video-player-controls-note premium-chip-row">
        {isDirectVideo ? (
          <>
            <div className="player-feature-chip">Segment Tracking</div>
            <div className="player-feature-chip">Seek Safe</div>
            <div className="player-feature-chip">Resume Enabled</div>
            <div className="player-feature-chip">Professional Mode</div>
          </>
        ) : (
          <>
            <div className="player-feature-chip">Embed Playback</div>
            <div className="player-feature-chip">Limited Tracking</div>
          </>
        )}

        <div className="player-feature-chip">
          {isGoogleDriveVideo
            ? "Drive Player"
            : isYouTubeVideo
            ? "YouTube Embed"
            : "Protected Player"}
        </div>

        <div className="player-feature-chip">
          Complete {requiredWatchPercent}%+
        </div>
      </div>

      {nextCountdown > 0 && hasNextVideo && (
        <div
          style={{
            marginTop: "14px",
            padding: "14px 18px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #93c5fd",
            color: "#1e3a8a",
            fontWeight: 800,
            textAlign: "center",
            boxShadow: "0 12px 24px rgba(59,130,246,0.12)",
          }}
        >
          Next video starts in {nextCountdown} second
          {nextCountdown > 1 ? "s" : ""}
        </div>
      )}

      <div className="video-player-actions premium-video-actions">
        <button
          type="button"
          className={`video-nav-btn elite-focus-ring ${
            !hasPreviousVideo ? "disabled" : ""
          }`}
          onClick={onPreviousVideo}
          disabled={!hasPreviousVideo}
        >
          Previous Video
        </button>

        <button
          type="button"
          className={`video-nav-btn primary elite-focus-ring ${
            !hasNextVideo ? "disabled" : ""
          }`}
          onClick={onNextVideo}
          disabled={!hasNextVideo}
        >
          Next Video
        </button>
      </div>

      <div className="video-learning-info-grid">
        <div className="video-info-card premium-info-card">
          <h4>Topic Summary</h4>
          <p>
            {selectedVideo.description} This section helps the learner focus on
            the main concept before moving ahead.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Verification Rule</h4>
          <p>
            This player uses segment-based verification. Simply jumping to the
            end does not complete the topic unless enough video segments were
            genuinely covered.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Tracking Mode</h4>
          <p>
            {isDirectVideo
              ? "Direct video uses smart 4-segment progress validation with resume support."
              : "Embedded playback works, but exact segment validation is not supported for iframe-based sources."}
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Status</h4>
          <p>
            {isEligibleComplete
              ? "This topic has reached the required verified watch threshold."
              : `Current verified segment completion is ${localProgress}%. Continue naturally to complete this lesson.`}
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          {isDirectVideo
            ? "Premium segment-based playback validation is active. Progress now depends on watched coverage instead of just dragging the seekbar."
            : isYouTubeVideo
            ? "YouTube is running in embedded mode. Playback works, but strict segment verification is not supported with iframe sources."
            : "Google Drive is running in embedded mode. Playback works, but strict segment verification is not supported with iframe sources."}
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;