const safeArray = (value) => (Array.isArray(value) ? value : []);

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sortByOrder = (items = []) => {
  return [...safeArray(items)].sort(
    (a, b) => safeNumber(a?.order, 0) - safeNumber(b?.order, 0)
  );
};

export const calculateWatchedVideos = (modules = []) => {
  let watched = 0;
  let total = 0;

  safeArray(modules).forEach((module) => {
    safeArray(module?.videos).forEach((video) => {
      total += 1;
      if (safeNumber(video?.watchedPercent, 0) > 0) {
        watched += 1;
      }
    });
  });

  return { watched, total };
};

export const calculateCompletedModules = (modules = []) => {
  const safeModules = safeArray(modules);

  const completed = safeModules.filter((module) => {
    const videos = safeArray(module?.videos);
    if (!videos.length) return false;

    return videos.every((video) => Boolean(video?.completed));
  }).length;

  return {
    completed,
    total: safeModules.length,
  };
};

export const calculateOverallProgress = (modules = []) => {
  let totalVideos = 0;
  let totalPercent = 0;

  safeArray(modules).forEach((module) => {
    safeArray(module?.videos).forEach((video) => {
      totalVideos += 1;
      totalPercent += safeNumber(video?.watchedPercent, 0);
    });
  });

  if (!totalVideos) return 0;
  return Math.round(totalPercent / totalVideos);
};

export const calculateDaysCompleted = (enrolledDate, durationDays = 0) => {
  const safeDurationDays = Math.max(0, safeNumber(durationDays, 0));

  if (!enrolledDate) {
    return {
      completedDays: 0,
      totalDays: safeDurationDays,
    };
  }

  const start = new Date(enrolledDate);
  const today = new Date();

  if (Number.isNaN(start.getTime())) {
    return {
      completedDays: 0,
      totalDays: safeDurationDays,
    };
  }

  const diffTime = today - start;
  const diffDays = Math.max(
    0,
    Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  );

  return {
    completedDays:
      diffDays > safeDurationDays ? safeDurationDays : diffDays,
    totalDays: safeDurationDays,
  };
};

export const isDurationCompleted = (enrolledDate, durationDays) => {
  const { completedDays, totalDays } = calculateDaysCompleted(
    enrolledDate,
    durationDays
  );
  return totalDays > 0 && completedDays >= totalDays;
};

export const getUnlockedModules = (
  modules = [],
  completedDays = 0,
  unlockAllPurchased = false
) => {
  return sortByOrder(modules).map((module, moduleIndex) => {
    const safeUnlockDay = Math.max(
      1,
      safeNumber(module?.unlockDay, moduleIndex + 1)
    );

    return {
      ...module,
      unlockDay: safeUnlockDay,
      order: safeNumber(module?.order, moduleIndex + 1),
      videos: sortByOrder(module?.videos),
      isUnlocked: Boolean(unlockAllPurchased) || completedDays >= safeUnlockDay,
    };
  });
};

export const getCertificateEligibility = ({
  progress = 0,
  requiredProgress = 80,
  miniTestPassed = false,
  durationCompleted = false,
}) => {
  const safeProgress = safeNumber(progress, 0);
  const safeRequiredProgress = safeNumber(requiredProgress, 80);

  return {
    progressCompleted: safeProgress >= safeRequiredProgress,
    miniTestCompleted: Boolean(miniTestPassed),
    durationCompleted: Boolean(durationCompleted),
    eligible:
      safeProgress >= safeRequiredProgress &&
      Boolean(miniTestPassed) &&
      Boolean(durationCompleted),
  };
};

export const getFirstAvailableVideo = (modules = []) => {
  const unlockedModules = safeArray(modules).filter((module) => module?.isUnlocked);

  for (const module of unlockedModules) {
    const videos = sortByOrder(module?.videos);

    for (const video of videos) {
      if (!video?.completed) {
        return { module: { ...module, videos }, video };
      }
    }

    if (videos.length > 0) {
      return { module: { ...module, videos }, video: videos[0] };
    }
  }

  return { module: null, video: null };
};

export const getAllUnlockedVideos = (modules = []) => {
  return safeArray(modules)
    .filter((module) => module?.isUnlocked)
    .flatMap((module) => {
      const videos = sortByOrder(module?.videos);

      return videos.map((video) => ({
        module: {
          ...module,
          videos,
        },
        video,
      }));
    });
};

export const getNextVideoItem = (modules = [], currentVideoId) => {
  const allVideos = getAllUnlockedVideos(modules);

  const currentIndex = allVideos.findIndex(
    (item) => String(item?.video?.id) === String(currentVideoId)
  );

  if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
    return allVideos[currentIndex + 1];
  }

  return null;
};

export const markVideoProgress = (
  modules = [],
  targetVideoId,
  watchedPercent = 0
) => {
  const safeWatchedPercent = Math.min(
    100,
    Math.max(0, safeNumber(watchedPercent, 0))
  );

  return safeArray(modules).map((module) => {
    const updatedVideos = safeArray(module?.videos).map((video) => {
      if (String(video?.id) !== String(targetVideoId)) return video;

      const currentPercent = safeNumber(video?.watchedPercent, 0);
      const finalPercent = Math.max(currentPercent, safeWatchedPercent);

      return {
        ...video,
        watchedPercent: finalPercent,
        completed: finalPercent >= 80,
      };
    });

    return {
      ...module,
      videos: updatedVideos,
    };
  });
};

export const getNextIncompleteVideo = (modules = []) => {
  const unlockedModules = safeArray(modules).filter((module) => module?.isUnlocked);

  for (const module of unlockedModules) {
    const videos = sortByOrder(module?.videos);

    for (const video of videos) {
      if (safeNumber(video?.watchedPercent, 0) < 80) {
        return {
          module: { ...module, videos },
          video,
        };
      }
    }
  }

  return null;
};
