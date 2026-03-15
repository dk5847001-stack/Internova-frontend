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
  onMarkDemoProgress,
  onVideoEnded,
  hasPreviousVideo,
  hasNextVideo,
}) {
  const videoRef = useRef(null);
  const sentMilestonesRef = useRef(new Set());
  const driveTrackingIntervalRef = useRef(null);
  const driveElapsedSecondsRef = useRef(0);
  const driveEndedTriggeredRef = useRef(false);
  const completionToastShownRef = useRef(false);
  const completionHandledRef = useRef(false);
  const nextCountdownIntervalRef = useRef(null);

  const [localProgress, setLocalProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isDriveTrackingPlaying, setIsDriveTrackingPlaying] = useState(false);
  const [driveElapsedSeconds, setDriveElapsedSeconds] = useState(0);
  const [nextCountdown, setNextCountdown] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const milestoneSteps = useMemo(() => [10, 25, 50, 80, 100], []);

  const rawVideoUrl = selectedVideo?.videoUrl || "";
  const embeddedVideoUrl = convertVideoUrlToEmbedUrl(rawVideoUrl);

  const isGoogleDriveVideo = isGoogleDriveLink(rawVideoUrl);
  const isYouTubeVideo = isYouTubeLink(rawVideoUrl);
  const isIframeVideo = isGoogleDriveVideo || isYouTubeVideo;

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

  const stopDriveTrackingInterval = () => {
    if (driveTrackingIntervalRef.current) {
      clearInterval(driveTrackingIntervalRef.current);
      driveTrackingIntervalRef.current = null;
    }
  };

  const handleCompletionFlow = () => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    setLocalProgress(100);
    setIsDriveTrackingPlaying(false);
    clearNextCountdown();
    stopDriveTrackingInterval();
    showCompletionToastOnce();

    if (onVideoEnded) {
      onVideoEnded();
    }

    if (hasNextVideo) {
      startNextCountdown();
    }
  };

  const parseDurationToSeconds = (durationText = "") => {
    if (!durationText || typeof durationText !== "string") return 0;

    const value = durationText.trim().toLowerCase();
    if (!value) return 0;

    if (value.includes(":")) {
      const parts = value
        .split(":")
        .map((part) => Number(part.trim()))
        .filter((part) => !Number.isNaN(part));

      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
      }

      if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
      }
    }

    let match = value.match(/(\d+(\.\d+)?)\s*(min|mins|minute|minutes)\b/);
    if (match?.[1]) {
      return Math.max(1, Math.round(Number(match[1]) * 60));
    }

    match = value.match(/(\d+(\.\d+)?)\s*(sec|secs|second|seconds)\b/);
    if (match?.[1]) {
      return Math.max(1, Math.round(Number(match[1])));
    }

    if (/^\d+(\.\d+)?$/.test(value)) {
      return Math.max(1, Math.round(Number(value) * 60));
    }

    return 0;
  };

  const formatSeconds = (seconds = 0) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const derivedDriveDurationSeconds = useMemo(() => {
    const parsed = parseDurationToSeconds(selectedVideo?.duration || "");
    return parsed > 0 ? parsed : 600;
  }, [selectedVideo]);

  useEffect(() => {
    setLocalProgress(selectedVideo?.watchedPercent || 0);
    setVideoDuration(0);
    setIsDriveTrackingPlaying(false);
    setDriveElapsedSeconds(0);
    setNextCountdown(0);
    completionToastShownRef.current = false;
    completionHandledRef.current = false;
    sentMilestonesRef.current = new Set();
    driveElapsedSecondsRef.current = 0;
    driveEndedTriggeredRef.current = false;
    clearNextCountdown();

    const alreadyWatched = selectedVideo?.watchedPercent || 0;
    milestoneSteps.forEach((step) => {
      if (alreadyWatched >= step) {
        sentMilestonesRef.current.add(step);
      }
    });

    if (alreadyWatched > 0 && derivedDriveDurationSeconds > 0) {
      const restoredSeconds = Math.floor(
        (alreadyWatched / 100) * derivedDriveDurationSeconds
      );
      driveElapsedSecondsRef.current = restoredSeconds;
      setDriveElapsedSeconds(restoredSeconds);
    }

    return () => {
      if (driveTrackingIntervalRef.current) {
        clearInterval(driveTrackingIntervalRef.current);
        driveTrackingIntervalRef.current = null;
      }
      clearNextCountdown();
    };
  }, [selectedVideo, milestoneSteps, derivedDriveDurationSeconds]);

  const pushTrackedMilestone = (percent) => {
    if (!selectedVideo || !onTrackedProgress) return;

    if (!sentMilestonesRef.current.has(percent)) {
      sentMilestonesRef.current.add(percent);
      onTrackedProgress(percent);
    }
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration || 0;
    setVideoDuration(duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const watched = Math.min(
      100,
      Math.floor((video.currentTime / video.duration) * 100)
    );

    setLocalProgress(watched);

    milestoneSteps.forEach((step) => {
      if (watched >= step) {
        pushTrackedMilestone(step);
      }
    });
  };

  const handleEndedInternal = () => {
    setLocalProgress(100);
    pushTrackedMilestone(100);
    handleCompletionFlow();
  };

  const startDriveTrackingInterval = () => {
    stopDriveTrackingInterval();

    driveTrackingIntervalRef.current = setInterval(() => {
      if (document.hidden || !isDriveTrackingPlaying) return;

      driveElapsedSecondsRef.current += 1;
      setDriveElapsedSeconds(driveElapsedSecondsRef.current);

      const watched = Math.min(
        100,
        Math.floor(
          (driveElapsedSecondsRef.current / derivedDriveDurationSeconds) * 100
        )
      );

      setLocalProgress((prev) => (watched > prev ? watched : prev));

      milestoneSteps.forEach((step) => {
        if (watched >= step) {
          pushTrackedMilestone(step);
        }
      });

      if (watched >= 100 && !driveEndedTriggeredRef.current) {
        driveEndedTriggeredRef.current = true;
        handleCompletionFlow();
      }
    }, 1000);
  };

  useEffect(() => {
    if (!isIframeVideo || !selectedVideo?.id) return;

    if (isDriveTrackingPlaying) {
      startDriveTrackingInterval();
    } else {
      stopDriveTrackingInterval();
    }

    return () => {
      stopDriveTrackingInterval();
    };
  }, [
    isIframeVideo,
    selectedVideo,
    isDriveTrackingPlaying,
    derivedDriveDurationSeconds,
    milestoneSteps,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopDriveTrackingInterval();
      } else if (isIframeVideo && isDriveTrackingPlaying) {
        startDriveTrackingInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isIframeVideo, isDriveTrackingPlaying, derivedDriveDurationSeconds]);

  const handleDriveTrackingPlayPause = () => {
    if (!isIframeVideo) return;
    setIsDriveTrackingPlaying((prev) => !prev);
  };

  const handleManualProgress = (percent) => {
    setLocalProgress((prev) => (percent > prev ? percent : prev));
    pushTrackedMilestone(percent);
    onMarkDemoProgress?.(percent);

    if (isIframeVideo && derivedDriveDurationSeconds > 0) {
      const mappedSeconds = Math.floor(
        (percent / 100) * derivedDriveDurationSeconds
      );
      driveElapsedSecondsRef.current = mappedSeconds;
      setDriveElapsedSeconds(mappedSeconds);
    }

    if (percent >= 100) {
      driveEndedTriggeredRef.current = true;
      handleCompletionFlow();
    }
  };

  const handlePreventContextMenu = (event) => {
    event.preventDefault();
  };

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

      <div className="video-player-header premium-video-header">
        <div>
          <p className="video-player-module">{selectedModule.title}</p>
          <h3>{selectedVideo.title}</h3>
          <span>{selectedVideo.description}</span>
        </div>

        <div className="video-player-status premium-video-status">
          <span>
            {selectedVideo.duration ||
              (videoDuration
                ? `${Math.floor(videoDuration / 60)}:${String(
                    Math.floor(videoDuration % 60)
                  ).padStart(2, "0")}`
                : "Video")}
          </span>
          <strong>
            {localProgress >= 80 ? "Completed" : `${localProgress}% Watched`}
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
              borderRadius: "18px",
              overflow: "hidden",
              background: "#000",
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
                height: "500px",
                border: "none",
                display: "block",
                borderRadius: "18px",
                background: "#000",
              }}
            />

            {!isYouTubeVideo && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "90px",
                  height: "90px",
                  zIndex: 10,
                  background: "transparent",
                  cursor: "default",
                }}
                aria-hidden="true"
              />
            )}
          </div>
        ) : (
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
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="video-player-controls-note premium-chip-row">
        {isIframeVideo ? (
          <>
            <button
              type="button"
              className="player-feature-chip"
              onClick={handleDriveTrackingPlayPause}
              style={{
                border: "none",
                cursor: "pointer",
                background: isDriveTrackingPlaying
                  ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                  : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                color: isDriveTrackingPlaying ? "#166534" : "#991b1b",
                fontWeight: 800,
                boxShadow: isDriveTrackingPlaying
                  ? "0 8px 20px rgba(34,197,94,0.18)"
                  : "0 8px 20px rgba(239,68,68,0.16)",
              }}
            >
              {isDriveTrackingPlaying ? "Pause Tracking" : "Play Tracking"}
            </button>

            <div
              className="player-feature-chip"
              style={{
                background: isDriveTrackingPlaying
                  ? "linear-gradient(135deg, #166534 0%, #22c55e 100%)"
                  : "linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: isDriveTrackingPlaying
                  ? "0 10px 24px rgba(34,197,94,0.25)"
                  : "0 10px 24px rgba(239,68,68,0.22)",
              }}
            >
              {isDriveTrackingPlaying ? "Tracking Live" : "Tracking Paused"}
            </div>

            <div
              className="player-feature-chip"
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                color: "#1d4ed8",
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(59,130,246,0.14)",
              }}
            >
              {formatSeconds(driveElapsedSeconds)} /{" "}
              {formatSeconds(derivedDriveDurationSeconds)}
            </div>
          </>
        ) : (
          <div className="player-feature-chip">Play / Pause</div>
        )}

        <div className="player-feature-chip">Replay</div>
        <div className="player-feature-chip">Speed Control</div>
        <div className="player-feature-chip">
          {isGoogleDriveVideo
            ? "Drive Player"
            : isYouTubeVideo
            ? "YouTube Embed"
            : "Protected Player"}
        </div>
        <div className="player-feature-chip">Fullscreen</div>
        <div className="player-feature-chip">
          {hasNextVideo ? "Autoplay Next Ready" : "Last Video"}
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
          Next video starts in {nextCountdown} second{nextCountdown > 1 ? "s" : ""}
        </div>
      )}

      <div className="video-demo-progress-row">
        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => handleManualProgress(25)}
        >
          Mark 25%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => handleManualProgress(50)}
        >
          Mark 50%
        </button>

        <button
          type="button"
          className="demo-progress-btn elite-focus-ring"
          onClick={() => handleManualProgress(80)}
        >
          Mark 80%
        </button>

        <button
          type="button"
          className="demo-progress-btn primary elite-focus-ring"
          onClick={() => handleManualProgress(100)}
        >
          Mark 100%
        </button>
      </div>

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
            {selectedVideo.description} This section should help the learner
            understand the main idea before moving to the next topic.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Learning Goal</h4>
          <p>
            Watch at least 80% of this topic to count it toward course
            completion and certificate eligibility.
          </p>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Resources</h4>
          <ul>
            <li>Topic notes PDF</li>
            <li>Practice examples</li>
            <li>Quick revision points</li>
          </ul>
        </div>

        <div className="video-info-card premium-info-card">
          <h4>Tracking Mode</h4>
          <p>
            {isGoogleDriveVideo
              ? `Custom duration-based Google Drive tracking is active using "${
                  selectedVideo.duration || "10 min"
                }" duration. Use Play Tracking / Pause Tracking to control timer.`
              : isYouTubeVideo
              ? `Custom duration-based YouTube tracking is active using "${
                  selectedVideo.duration || "10 min"
                }" duration. Use Play Tracking / Pause Tracking to control timer.`
              : "This video now tracks real watch milestones and updates course progress progressively."}
          </p>
        </div>
      </div>

      <div className="video-player-feature-note premium-feature-note">
        <p>
          {isGoogleDriveVideo
            ? "Google Drive videos now use custom duration-based tracking. Timer starts only when you press Play Tracking and pauses when you press Pause Tracking or leave the tab."
            : isYouTubeVideo
            ? "YouTube videos now run in embedded mode. Direct file download is not exposed from your app, and progress tracking works through the custom timer flow."
            : "Direct videos now use a more protected player mode with nodownload enabled. Next upgrade can add resume position, speed memory, and stronger anti-skip tracking."}
        </p>
      </div>
    </div>
  );
}

export default VideoPlayerSection;