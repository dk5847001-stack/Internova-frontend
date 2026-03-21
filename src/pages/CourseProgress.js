import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrandLoader from "../components/BrandLoader";

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
  createUnlockAllOrder,
  verifyUnlockAllPayment,
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
  const [unlockingAll, setUnlockingAll] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      return null;
    }
  }, []);

  const showToast = (type, title, message) => {
    setToast({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "success",
        title: "",
        message: "",
      });
    }, 3200);
  };

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
      showToast(
        "error",
        "Mini Test Locked",
        `Complete at least ${
          course?.miniTestUnlockProgress || 80
        }% progress to open the mini test.`
      );
      return;
    }
    navigate(`/quiz/${internshipId}`);
  };

  const handleOpenCertificate = () => {
    navigate(`/certificate/${internshipId}`);
  };

  const handleUnlockAllModules = async () => {
    if (!internshipId || !course || course.unlockAllPurchased) return;

    if (!window.Razorpay) {
      showToast(
        "error",
        "Payment Unavailable",
        "Razorpay SDK not loaded. Please refresh the page and try again."
      );
      return;
    }

    try {
      setUnlockingAll(true);

      const orderData = await createUnlockAllOrder(internshipId);

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "Internova",
          description: `Unlock all modules - ${course.title}`,
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await verifyUnlockAllPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyRes?.success) {
                throw new Error(
                  verifyRes?.message || "Unlock-all payment verification failed"
                );
              }

              resolve(verifyRes);
            } catch (error) {
              reject(error);
            }
          },
          modal: {
            ondismiss: function () {
              reject(new Error("Payment cancelled by user"));
            },
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#1d4ed8",
          },
        });

        rzp.open();
      });

      await loadCourseData();

      showToast(
        "success",
        "Premium Access Activated",
        "All locked modules are now unlocked successfully for this Internship Programs."
      );
    } catch (err) {
      console.error("Unlock all modules failed:", err);

      if (err?.message && err.message !== "Payment cancelled by user") {
        showToast(
          "error",
          "Unlock Failed",
          err.message || "Unable to complete unlock-all payment."
        );
      }
    } finally {
      setUnlockingAll(false);
    }
  };

 if (loading) {
  return <BrandLoader title="Loading programs" />;
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
    <div className="course-progress-shell position-relative">
      <style>{`
        .course-page-toast {
          position: fixed;
          top: 92px;
          right: 24px;
          z-index: 99999;
          min-width: 280px;
          max-width: 390px;
        }

        .course-page-toast-box {
          border-radius: 20px;
          padding: 16px 18px;
          box-shadow: 0 22px 46px rgba(15, 23, 42, 0.16);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .course-page-toast-box.success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
        }

        .course-page-toast-box.error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #fca5a5;
        }

        .course-page-toast-title {
          font-size: 0.96rem;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .course-page-toast-title.success {
          color: #065f46;
        }

        .course-page-toast-title.error {
          color: #b91c1c;
        }

        .course-page-toast-message {
          color: #1f2937;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        @media (max-width: 767px) {
          .course-page-toast {
            left: 14px;
            right: 14px;
            top: 86px;
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>

      {toast.show && (
        <div className="course-page-toast">
          <div className={`course-page-toast-box ${toast.type}`}>
            <div className={`course-page-toast-title ${toast.type}`}>
              {toast.title}
            </div>
            <div className="course-page-toast-message">{toast.message}</div>
          </div>
        </div>
      )}

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
            loading={unlockingAll}
            price={course.unlockAllPrice || 99}
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