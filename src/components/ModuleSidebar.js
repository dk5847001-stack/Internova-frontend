import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

function ModuleSidebar({
  modules,
  selectedModule,
  selectedVideo,
  onSelectVideo,
}) {
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    if (selectedModule?.id) {
      setOpenModuleId(selectedModule.id);
    } else if (modules?.length) {
      const firstUnlocked = modules.find((module) => module.isUnlocked);
      if (firstUnlocked) setOpenModuleId(firstUnlocked.id);
    }
  }, [selectedModule, modules]);

  const handleToggleModule = (module) => {
    if (!module.isUnlocked) return;
    setOpenModuleId((prev) => (prev === module.id ? null : module.id));
  };

  const getModuleProgress = (module) => {
    if (!module.videos?.length) return 0;

    const totalPercent = module.videos.reduce(
      (sum, video) => sum + (video.watchedPercent || 0),
      0
    );

    return Math.round(totalPercent / module.videos.length);
  };

  return (
    <aside className="course-module-sidebar pro-sidebar-card left-course-sidebar">
      <div className="course-sidebar-top">
        <p className="section-kicker">Structured Learning Path</p>
        <h3>Course Modules</h3>
        <p>
          Follow your Internship Programs roadmap module by module and continue learning
          with clear progress visibility.
        </p>
      </div>

      <div className="pro-module-stack">
        {modules.map((module, index) => {
          const isOpen = openModuleId === module.id;
          const isSelected = selectedModule?.id === module.id;
          const moduleProgress = getModuleProgress(module);

          return (
            <div
              key={module.id}
              className={`pro-module-card ${isSelected ? "active" : ""} ${
                !module.isUnlocked ? "locked" : ""
              }`}
            >
              <button
                type="button"
                className={`pro-module-header ${
                  !module.isUnlocked ? "locked-btn" : ""
                }`}
                onClick={() => handleToggleModule(module)}
              >
                <div className="pro-module-left">
                  <div className="pro-module-index">{index + 1}</div>

                  <div className="pro-module-copy">
                    <div className="pro-module-title-row">
                      <h4>{module.title}</h4>

                      <span
                        className={`pro-module-badge ${
                          module.isUnlocked ? "unlocked" : "locked"
                        }`}
                      >
                        {module.isUnlocked ? (
                          `${moduleProgress}%`
                        ) : (
                          <>
                            <FaLock />
                            <span>Day {module.unlockDay}</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p>{module.description}</p>

                    {!module.isUnlocked && (
                      <small className="pro-module-lock-note">
                        Locked until Internship Programs day {module.unlockDay} or premium
                        unlock activation.
                      </small>
                    )}
                  </div>
                </div>

                <span className={`pro-module-arrow ${isOpen ? "open" : ""}`}>
                  <FaChevronDown />
                </span>
              </button>

              <div className="pro-module-progress-wrap">
                <div className="pro-module-progress-bar">
                  <div
                    className="pro-module-progress-fill"
                    style={{ width: `${module.isUnlocked ? moduleProgress : 0}%` }}
                  />
                </div>
              </div>

              {isOpen && (
                <div className="pro-module-body">
                  {module.isUnlocked ? (
                    <div className="pro-video-list">
                      {module.videos.map((video) => {
                        const isVideoSelected = selectedVideo?.id === video.id;
                        const isCompleted = (video.watchedPercent || 0) >= 80;

                        return (
                          <button
                            key={video.id}
                            type="button"
                            className={`pro-video-item elite-focus-ring ${
                              isVideoSelected ? "active" : ""
                            } ${isCompleted ? "completed" : ""}`}
                            onClick={() => onSelectVideo(module, video)}
                          >
                            <div className="pro-video-left">
                              <div
                                className={`pro-video-icon ${
                                  isVideoSelected ? "active" : ""
                                } ${isCompleted ? "done" : ""}`}
                              >
                                {isCompleted ? (
                                  <FaCheckCircle />
                                ) : isVideoSelected ? (
                                  <FaPause />
                                ) : (
                                  <FaPlay />
                                )}
                              </div>

                              <div className="pro-video-copy compact-video-copy">
                                <div className="pro-video-topline compact-video-topline">
                                  <strong title={video.title}>{video.title}</strong>

                                  {isCompleted && (
                                    <span className="pro-video-status-chip">
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="pro-video-right">
                              <small>{video.duration}</small>
                              <em>
                                {isCompleted
                                  ? "80%+ Watched"
                                  : video.watchedPercent > 0
                                  ? `${video.watchedPercent}% Watched`
                                  : "Not Started"}
                              </em>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="pro-locked-box premium-locked-box">
                      <div className="pro-locked-icon">
                        <FaLock />
                      </div>

                      <div>
                        <strong>This module is currently locked.</strong>
                        <p>
                          It becomes available on Internship Programs day {module.unlockDay}.
                          You can also unlock all remaining modules early through
                          verified premium access.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ModuleSidebar;