import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CourseHeader from "../components/CourseHeader";
import CourseProgressCard from "../components/CourseProgressCard";
import EligibilityStatusBox from "../components/EligibilityStatusBox";
import ModuleSidebar from "../components/ModuleSidebar";
import VideoPlayerSection from "../components/VideoPlayerSection";
import MiniTestActionCard from "../components/MiniTestActionCard";
import CertificateActionCard from "../components/CertificateActionCard";
import UnlockAllModulesCard from "../components/UnlockAllModulesCard";
import UnlockTimeline from "../components/UnlockTimeline";
import ContinueLearningCard from "../components/ContinueLearningCard";

import {
  getCourseProgress,
  updateVideoProgress,
  unlockAllModules,
} from "../services/courseService";

import {
  calculateCompletedModules,
  calculateDaysCompleted,
  calculateOverallProgress,
  calculateWatchedVideos,
  getCertificateEligibility,
  getFirstAvailableVideo,
  getUnlockedModules,
  getAllUnlockedVideos,
  getNextIncompleteVideo,
  getNextVideoItem,
  markVideoProgress,
} from "../utils/courseHelpers";

function CourseProgress() {
  const navigate = useNavigate();
  const { internshipId } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseProgress(internshipId);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to load course data");
      }

      const courseData = {
        id: response.course.id,
        title: response.course.title,
        category: response.course.category || "",
        branch: response.course.branch || "",
        durationLabel:
          response.course.duration || `${response.course.durationDays} Days`,
        durationDays: response.course.durationDays || 30,
        enrolledDate: response.progress.enrolledAt,
        status: "In Progress",
        certificateStatus: response.eligibility?.eligible ? "Eligible" : "Locked",
        miniTestPassed: response.progress?.miniTestPassed || false,
        unlockAllPurchased: response.progress?.unlockAllPurchased || false,
        requiredProgress: response.course.requiredProgress || 80,
        miniTestUnlockProgress: response.course.miniTestUnlockProgress || 80,
        miniTestPassMarks: response.course.miniTestPassMarks || 60,
        unlockAllPrice: response.course.unlockAllPrice || 99,
      };

      const modulesData = (response.modules || []).map((module) => ({
        ...module,
        id: module._id,
        videos: (module.videos || []).map((video) => {
          const matchedProgress = (response.progress?.videoProgress || []).find(
            (vp) => vp.videoId?.toString() === video._id?.toString()
          );

          return {
            id: video._id,
            title: video.title,
            description: video.description || "",
            duration: video.duration || "",
            videoUrl: video.videoUrl,
            watchedPercent: matchedProgress?.watchedPercent || 0,
            completed: matchedProgress?.completed || false,
          };
        }),
      }));

      setCourse(courseData);
      setModules(modulesData);
    } catch (err) {
      console.error("Failed to load course data:", err);
      setError(
        err?.message ||
          "We could not load your course right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (internshipId) {
      loadCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const derivedData = useMemo(() => {
    if (!course || !modules.length) return null;

    const { completedDays, totalDays } = calculateDaysCompleted(
      course.enrolledDate,
      course.durationDays
    );

    const unlockedModules = getUnlockedModules(
      modules,
      completedDays,
      course.unlockAllPurchased
    );

    const overallProgress = calculateOverallProgress(unlockedModules);
    const { watched, total } = calculateWatchedVideos(unlockedModules);
    const { completed, total: totalModules } =
      calculateCompletedModules(unlockedModules);

    const lockedModules = unlockedModules.filter(
      (module) => !module.isUnlocked
    ).length;

    const eligibility = getCertificateEligibility({
      progress: overallProgress,
      requiredProgress: course.requiredProgress,
      miniTestPassed: course.miniTestPassed,
      durationCompleted: completedDays >= totalDays,
    });

    const allUnlockedVideos = getAllUnlockedVideos(unlockedModules);

    return {
      unlockedModules,
      overallProgress,
      watchedVideos: watched,
      totalVideos: total,
      completedModules: completed,
      totalModules,
      completedDays,
      totalDays,
      lockedModules,
      eligibility,
      allUnlockedVideos,
      nextVideoItem: selectedVideo
        ? getNextVideoItem(unlockedModules, selectedVideo.id)
        : getNextIncompleteVideo(unlockedModules),
    };
  }, [course, modules, selectedVideo]);

  useEffect(() => {
    if (!derivedData?.unlockedModules?.length) return;

    const hasValidSelection =
      selectedModule &&
      selectedVideo &&
      derivedData.unlockedModules.some(
        (module) =>
          module.id === selectedModule.id &&
          module.videos.some((video) => video.id === selectedVideo.id)
      );

    if (!hasValidSelection) {
      const firstAvailable = getFirstAvailableVideo(derivedData.unlockedModules);
      setSelectedModule(firstAvailable.module);
      setSelectedVideo(firstAvailable.video);
    }
  }, [derivedData, selectedModule, selectedVideo]);

  const handleSelectVideo = (module, video) => {
    setSelectedModule(module);
    setSelectedVideo(video);
  };

  const handlePreviousVideo = () => {
    if (!selectedVideo || !derivedData?.allUnlockedVideos?.length) return;

    const currentIndex = derivedData.allUnlockedVideos.findIndex(
      (item) => item.video.id === selectedVideo.id
    );

    if (currentIndex > 0) {
      const previousItem = derivedData.allUnlockedVideos[currentIndex - 1];
      setSelectedModule(previousItem.module);
      setSelectedVideo(previousItem.video);
    }
  };

  const handleNextVideo = () => {
    if (!selectedVideo || !derivedData?.allUnlockedVideos?.length) return;

    const currentIndex = derivedData.allUnlockedVideos.findIndex(
      (item) => item.video.id === selectedVideo.id
    );

    if (
      currentIndex >= 0 &&
      currentIndex < derivedData.allUnlockedVideos.length - 1
    ) {
      const nextItem = derivedData.allUnlockedVideos[currentIndex + 1];
      setSelectedModule(nextItem.module);
      setSelectedVideo(nextItem.video);
    }
  };

  const handleTrackedProgress = async (percent) => {
    if (!selectedVideo || !selectedModule || !internshipId) return;

    try {
      const response = await updateVideoProgress(internshipId, {
        moduleId: selectedModule.id || selectedModule._id,
        videoId: selectedVideo.id,
        watchedPercent: percent,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update tracked progress");
      }

      setModules((prev) => markVideoProgress(prev, selectedVideo.id, percent));

      if (percent >= 80) {
        setCourse((prev) => ({
          ...prev,
          miniTestPassed: prev?.miniTestPassed || false,
        }));
      }
    } catch (error) {
      console.error("Tracked progress update failed:", error);
    }
  };

  const handleMarkDemoProgress = async (percent) => {
    if (!selectedVideo || !selectedModule || !internshipId) return;

    try {
      const response = await updateVideoProgress(internshipId, {
        moduleId: selectedModule.id || selectedModule._id,
        videoId: selectedVideo.id,
        watchedPercent: percent,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update progress");
      }

      setModules((prev) => markVideoProgress(prev, selectedVideo.id, percent));
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  const handleVideoEnded = async () => {
    if (!selectedVideo || !selectedModule || !derivedData?.unlockedModules?.length)
      return;

    try {
      const response = await updateVideoProgress(internshipId, {
        moduleId: selectedModule.id || selectedModule._id,
        videoId: selectedVideo.id,
        watchedPercent: 100,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update video progress");
      }

      setModules((prev) => markVideoProgress(prev, selectedVideo.id, 100));

      const nextItem = getNextVideoItem(
        derivedData.unlockedModules,
        selectedVideo.id
      );

      if (nextItem) {
        setSelectedModule(nextItem.module);
        setSelectedVideo(nextItem.video);
      }
    } catch (err) {
      console.error("Video end progress update failed:", err);
    }
  };

  const handleOpenMiniTest = () => {
    if (derivedData?.overallProgress < (course?.miniTestUnlockProgress || 80)) {
      return;
    }
    navigate(`/quiz/${internshipId}`);
  };

  const handleOpenCertificate = () => {
    navigate(`/certificate/${internshipId}`);
  };

  const handleUnlockAllModules = async () => {
    if (!internshipId) return;

    try {
      const response = await unlockAllModules(internshipId);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to unlock all modules");
      }

      setCourse((prev) => ({
        ...prev,
        unlockAllPurchased: true,
      }));
    } catch (err) {
      console.error("Unlock all modules failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="course-progress-shell">
        <div className="course-bg-orb orb-one" />
        <div className="course-bg-orb orb-two" />
        <div className="course-bg-orb orb-three" />

        <div className="course-progress-page full-width-course-page">
          <div className="course-state-card loading-state">
            <div className="state-shimmer state-shimmer-lg" />
            <div className="state-shimmer state-shimmer-md" />
            <div className="state-shimmer state-shimmer-sm" />
            <p>Loading your internship learning dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course || !derivedData) {
    return (
      <div className="course-progress-shell">
        <div className="course-bg-orb orb-one" />
        <div className="course-bg-orb orb-two" />
        <div className="course-bg-orb orb-three" />

        <div className="course-progress-page full-width-course-page">
          <div className="course-state-card error-state">
            <h3>Unable to Load Course</h3>
            <p>
              {error ||
                "Course data is not available right now. Please refresh and try again."}
            </p>

            <button
              type="button"
              className="course-state-btn"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-progress-shell">
      <div className="course-bg-orb orb-one" />
      <div className="course-bg-orb orb-two" />
      <div className="course-bg-orb orb-three" />

      <div className="course-progress-page full-width-course-page">
        <CourseHeader course={course} />

        <CourseProgressCard
          overallProgress={derivedData.overallProgress}
          watchedVideos={derivedData.watchedVideos}
          totalVideos={derivedData.totalVideos}
          completedModules={derivedData.completedModules}
          totalModules={derivedData.totalModules}
          completedDays={derivedData.completedDays}
          totalDays={derivedData.totalDays}
          lockedModules={derivedData.lockedModules}
        />

        <ContinueLearningCard
          selectedModule={selectedModule}
          selectedVideo={selectedVideo}
          nextVideoLabel={derivedData?.nextVideoItem?.video?.title}
          overallProgress={derivedData.overallProgress}
        />

        <EligibilityStatusBox
          eligibility={derivedData.eligibility}
          requiredProgress={course.requiredProgress}
        />

        <div className="course-learning-layout left-sidebar-layout">
          <ModuleSidebar
            modules={derivedData.unlockedModules}
            selectedModule={selectedModule}
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
          />

          <VideoPlayerSection
            selectedModule={selectedModule}
            selectedVideo={selectedVideo}
            onPreviousVideo={handlePreviousVideo}
            onNextVideo={handleNextVideo}
            onTrackedProgress={handleTrackedProgress}
            onMarkDemoProgress={handleMarkDemoProgress}
            onVideoEnded={handleVideoEnded}
            hasPreviousVideo={
              derivedData?.allUnlockedVideos?.findIndex(
                (item) => item.video.id === selectedVideo?.id
              ) > 0
            }
            hasNextVideo={Boolean(derivedData?.nextVideoItem)}
          />
        </div>

        <div className="course-actions-grid">
          <MiniTestActionCard
            progress={derivedData.overallProgress}
            requiredProgress={course.miniTestUnlockProgress || course.requiredProgress}
            miniTestPassed={course.miniTestPassed}
            onOpenMiniTest={handleOpenMiniTest}
          />

          <CertificateActionCard
            eligibility={derivedData.eligibility}
            onOpenCertificate={handleOpenCertificate}
          />

          <UnlockAllModulesCard
            lockedModules={derivedData.lockedModules}
            unlockAllPurchased={course.unlockAllPurchased}
            onUnlockAllModules={handleUnlockAllModules}
          />
        </div>

        <UnlockTimeline
          modules={derivedData.unlockedModules}
          completedDays={derivedData.completedDays}
        />
      </div>
    </div>
  );
}

export default CourseProgress;