import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../services/api";

const makeDuration = () => ({
  label: "",
  price: 0,
  durationDays: 30,
});

const makeVideo = () => ({
  title: "",
  description: "",
  videoUrl: "",
  duration: "",
  order: 1,
});

const makeModule = () => ({
  title: "",
  description: "",
  unlockDay: 1,
  order: 1,
  videos: [makeVideo()],
});

const makeQuizQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

const reOrderList = (items = [], extraMapper) => {
  return items.map((item, index) => {
    const nextItem = { ...item, order: index + 1 };
    return extraMapper ? extraMapper(nextItem, index) : nextItem;
  });
};

const moveItem = (list, fromIndex, toIndex) => {
  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

const sanitizeImportedData = (data = {}) => {
  const durations = Array.isArray(data.durations) && data.durations.length
    ? reOrderList(
        data.durations.map((d) => ({
          label: d?.label || "",
          price: Number(d?.price || 0),
          durationDays: Number(d?.durationDays || 30),
        }))
      )
    : initialForm.durations;

  const modules = Array.isArray(data.modules) && data.modules.length
    ? reOrderList(
        data.modules.map((m, index) => ({
          title: m?.title || "",
          description: m?.description || "",
          unlockDay: Number(m?.unlockDay || index + 1),
          order: Number(m?.order || index + 1),
          videos:
            Array.isArray(m?.videos) && m.videos.length
              ? reOrderList(
                  m.videos.map((v, vIndex) => ({
                    title: v?.title || "",
                    description: v?.description || "",
                    videoUrl: v?.videoUrl || "",
                    duration: v?.duration || "",
                    order: Number(v?.order || vIndex + 1),
                  }))
                )
              : [makeVideo()],
        })),
        (module) => ({
          ...module,
          videos: reOrderList(module.videos || []),
        })
      )
    : [makeModule()];

  const quiz = Array.isArray(data.quiz) && data.quiz.length
    ? data.quiz.map((q) => ({
        question: q?.question || "",
        options:
          Array.isArray(q?.options) && q.options.length === 4
            ? q.options.map((opt) => opt || "")
            : ["", "", "", ""],
        correctAnswer: Number(q?.correctAnswer || 0),
      }))
    : [makeQuizQuestion()];

  return {
    title: data.title || "",
    slug: data.slug || "",
    branch: data.branch || "",
    category: data.category || "",
    description: data.description || "",
    thumbnail: data.thumbnail || "",
    image: data.image || "",
    requiredProgress: Number(data.requiredProgress || 80),
    miniTestUnlockProgress: Number(data.miniTestUnlockProgress || 80),
    miniTestPassMarks: Number(data.miniTestPassMarks || 60),
    unlockAllPrice: Number(data.unlockAllPrice || 99),
    certificateEnabled:
      typeof data.certificateEnabled === "boolean" ? data.certificateEnabled : true,
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    durations,
    modules,
    quiz,
  };
};

const initialForm = {
  title: "",
  slug: "",
  branch: "",
  category: "",
  description: "",
  thumbnail: "",
  image: "",
  requiredProgress: 80,
  miniTestUnlockProgress: 80,
  miniTestPassMarks: 60,
  unlockAllPrice: 99,
  certificateEnabled: true,
  isActive: true,
  durations: [
    { label: "1 Month", price: 1, durationDays: 30, order: 1 },
    { label: "3 Months", price: 990, durationDays: 90, order: 2 },
    { label: "6 Months", price: 1490, durationDays: 180, order: 3 },
  ],
  modules: [makeModule()],
  quiz: [makeQuizQuestion()],
};

function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

  const fileInputRef = useRef(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const sortedModulesPreview = useMemo(() => {
    return reOrderList(
      (formData.modules || []).map((module) => ({
        ...module,
        videos: reOrderList(module.videos || []),
      }))
    );
  }, [formData.modules]);

  const sortedQuizPreview = useMemo(() => {
    return (formData.quiz || []).filter((q) => q.question?.trim());
  }, [formData.quiz]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships/admin/all");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      showToast("error", "Failed to fetch programs");
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (!previewVideo) {
      const firstVideo =
        sortedModulesPreview
          ?.find((module) => module.videos?.length)
          ?.videos?.[0] || null;
      setPreviewVideo(firstVideo);
    }
  }, [sortedModulesPreview, previewVideo]);

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "requiredProgress",
              "miniTestUnlockProgress",
              "miniTestPassMarks",
              "unlockAllPrice",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleDurationChange = (index, field, value) => {
    const updated = [...formData.durations];
    updated[index][field] =
      field === "price" || field === "durationDays" || field === "order"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      durations: updated,
    }));
  };

  const addDuration = () => {
    setFormData((prev) => ({
      ...prev,
      durations: [
        ...prev.durations,
        {
          ...makeDuration(),
          order: prev.durations.length + 1,
        },
      ],
    }));
  };

  const removeDuration = (index) => {
    if (formData.durations.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      durations: reOrderList(prev.durations.filter((_, i) => i !== index)),
    }));
  };

  const moveDurationUp = (index) => {
    if (index === 0) return;

    setFormData((prev) => ({
      ...prev,
      durations: reOrderList(moveItem(prev.durations, index, index - 1)),
    }));
  };

  const moveDurationDown = (index) => {
    if (index === formData.durations.length - 1) return;

    setFormData((prev) => ({
      ...prev,
      durations: reOrderList(moveItem(prev.durations, index, index + 1)),
    }));
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...formData.modules];
    updated[index][field] =
      field === "unlockDay" || field === "order" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: reOrderList([
        ...prev.modules,
        {
          ...makeModule(),
          order: prev.modules.length + 1,
          unlockDay: prev.modules.length + 1,
        },
      ]),
    }));
  };

  const removeModule = (index) => {
    if (formData.modules.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      modules: reOrderList(
        prev.modules.filter((_, i) => i !== index),
        (module) => ({
          ...module,
          videos: reOrderList(module.videos || []),
        })
      ),
    }));
  };

  const moveModuleUp = (index) => {
    if (index === 0) return;

    setFormData((prev) => ({
      ...prev,
      modules: reOrderList(
        moveItem(prev.modules, index, index - 1),
        (module) => ({
          ...module,
          videos: reOrderList(module.videos || []),
        })
      ),
    }));
  };

  const moveModuleDown = (index) => {
    if (index === formData.modules.length - 1) return;

    setFormData((prev) => ({
      ...prev,
      modules: reOrderList(
        moveItem(prev.modules, index, index + 1),
        (module) => ({
          ...module,
          videos: reOrderList(module.videos || []),
        })
      ),
    }));
  };

  const handleVideoChange = (moduleIndex, videoIndex, field, value) => {
    const updated = [...formData.modules];
    updated[moduleIndex].videos[videoIndex][field] =
      field === "order" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const addVideo = (moduleIndex) => {
    const updated = [...formData.modules];
    updated[moduleIndex].videos = reOrderList([
      ...updated[moduleIndex].videos,
      {
        ...makeVideo(),
        order: updated[moduleIndex].videos.length + 1,
      },
    ]);

    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const removeVideo = (moduleIndex, videoIndex) => {
    const updated = [...formData.modules];
    if (updated[moduleIndex].videos.length === 1) return;

    const removedVideo = updated[moduleIndex].videos[videoIndex];
    updated[moduleIndex].videos = reOrderList(
      updated[moduleIndex].videos.filter((_, i) => i !== videoIndex)
    );

    setFormData((prev) => ({ ...prev, modules: updated }));

    if (previewVideo?.title === removedVideo?.title) {
      const fallbackVideo = updated[moduleIndex].videos[0] || null;
      setPreviewVideo(fallbackVideo);
    }
  };

  const moveVideoUp = (moduleIndex, videoIndex) => {
    if (videoIndex === 0) return;

    const updated = [...formData.modules];
    updated[moduleIndex].videos = reOrderList(
      moveItem(updated[moduleIndex].videos, videoIndex, videoIndex - 1)
    );

    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const moveVideoDown = (moduleIndex, videoIndex) => {
    const updated = [...formData.modules];
    if (videoIndex === updated[moduleIndex].videos.length - 1) return;

    updated[moduleIndex].videos = reOrderList(
      moveItem(updated[moduleIndex].videos, videoIndex, videoIndex + 1)
    );

    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleQuizChange = (qIndex, field, value) => {
    const updated = [...formData.quiz];
    updated[qIndex][field] =
      field === "correctAnswer" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const handleQuizOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.quiz];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const addQuizQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      quiz: [...prev.quiz, makeQuizQuestion()],
    }));
  };

  const removeQuizQuestion = (qIndex) => {
    if (formData.quiz.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      quiz: prev.quiz.filter((_, i) => i !== qIndex),
    }));
  };

  const moveQuizUp = (qIndex) => {
    if (qIndex === 0) return;

    setFormData((prev) => ({
      ...prev,
      quiz: moveItem(prev.quiz, qIndex, qIndex - 1),
    }));
  };

  const moveQuizDown = (qIndex) => {
    if (qIndex === formData.quiz.length - 1) return;

    setFormData((prev) => ({
      ...prev,
      quiz: moveItem(prev.quiz, qIndex, qIndex + 1),
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setPreviewVideo(null);
    showToast("success", "Form reset successfully");
  };

  const buildPayload = () => {
    return {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      branch: formData.branch.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      thumbnail: formData.thumbnail.trim(),
      image: formData.image.trim(),
      requiredProgress: Number(formData.requiredProgress),
      miniTestUnlockProgress: Number(formData.miniTestUnlockProgress),
      miniTestPassMarks: Number(formData.miniTestPassMarks),
      unlockAllPrice: Number(formData.unlockAllPrice),
      certificateEnabled: !!formData.certificateEnabled,
      isActive: !!formData.isActive,

      durations: reOrderList(formData.durations)
        .filter((d) => d.label.trim())
        .map((d, index) => ({
          label: d.label.trim(),
          price: Number(d.price),
          durationDays: Number(d.durationDays || 30),
          order: index + 1,
        })),

      modules: reOrderList(formData.modules)
        .filter((m) => m.title.trim())
        .map((m, index) => ({
          title: m.title.trim(),
          description: m.description.trim(),
          unlockDay: Number(m.unlockDay || index + 1),
          order: index + 1,
          videos: reOrderList(m.videos || [])
            .filter((v) => v.title.trim() && v.videoUrl.trim())
            .map((v, vIndex) => ({
              title: v.title.trim(),
              description: v.description.trim(),
              videoUrl: v.videoUrl.trim(),
              duration: v.duration.trim(),
              order: vIndex + 1,
            })),
        })),

      quiz: formData.quiz
        .filter(
          (q) =>
            q.question.trim() &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.options.every((opt) => opt.trim() !== "")
        )
        .map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: Number(q.correctAnswer),
        })),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = buildPayload();

      if (!payload.title || !payload.branch || !payload.description) {
        showToast("error", "Title, branch and description are required");
        return;
      }

      if (!payload.durations.length) {
        showToast("error", "At least one duration is required");
        return;
      }

      if (editingId) {
        await API.put(`/internships/${editingId}`, payload);
        showToast("success", "Internship updated successfully");
      } else {
        await API.post("/internships", payload);
        showToast("success", "Internship created successfully");
      }

      resetForm();
      fetchInternships();
    } catch (error) {
      console.error("Save internship failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to save internship"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      const internship = data.internship;

      const nextForm = sanitizeImportedData(internship);

      setFormData(nextForm);
      setEditingId(id);

      const firstPreview =
        nextForm.modules?.find((module) => module.videos?.length)?.videos?.[0] ||
        null;
      setPreviewVideo(firstPreview);

      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("success", "Internship loaded for editing");
    } catch (error) {
      console.error("Failed to load internship for edit:", error);
      showToast("error", "Failed to load internship for editing");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      const internship = data.internship;

      const duplicated = sanitizeImportedData({
        ...internship,
        title: `${internship.title || "Internship"} Copy`,
        slug: internship.slug ? `${internship.slug}-copy` : "",
        isActive: false,
      });

      setFormData(duplicated);
      setEditingId(null);

      const firstPreview =
        duplicated.modules?.find((module) => module.videos?.length)?.videos?.[0] ||
        null;
      setPreviewVideo(firstPreview);

      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("success", "Internship duplicated into form");
    } catch (error) {
      console.error("Duplicate internship failed:", error);
      showToast("error", "Failed to duplicate internship");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this internship?");
    if (!ok) return;

    try {
      await API.delete(`/internships/${id}`);
      showToast("success", "Internship deleted successfully");
      fetchInternships();
    } catch (error) {
      console.error("Delete internship failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete internship"
      );
    }
  };

  const handleExportJson = () => {
    try {
      const payload = buildPayload();
      const fileName = `${(payload.title || "internship")
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}_export.json`;

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showToast("success", "Internship JSON exported successfully");
    } catch (error) {
      console.error("Export JSON failed:", error);
      showToast("error", "Failed to export JSON");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportJson = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const parsed = JSON.parse(text);
      const importedForm = sanitizeImportedData(parsed);

      setFormData(importedForm);
      setEditingId(null);

      const firstPreview =
        importedForm.modules?.find((module) => module.videos?.length)?.videos?.[0] ||
        null;
      setPreviewVideo(firstPreview);

      showToast("success", "Internship JSON imported successfully");
    } catch (error) {
      console.error("Import JSON failed:", error);
      showToast("error", "Invalid JSON file");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <style>{`
        .admin-internships-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .admin-internships-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: adminFloat 9s ease-in-out infinite;
          -webkit-animation: adminFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .admin-internships-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .admin-internships-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .admin-internships-shell {
          position: relative;
          z-index: 2;
        }

        .admin-hero {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .admin-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .admin-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .admin-hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .admin-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 760px;
        }

        .admin-stat-card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 22px;
          padding: 18px;
          height: 100%;
        }

        .admin-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .admin-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .admin-glass-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .admin-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .admin-section-subtitle {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 22px;
        }

        .admin-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
        }

        .admin-input,
        .admin-textarea,
        .admin-select {
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
        }

        .admin-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .admin-sub-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 20px;
        }

        .admin-mini-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .admin-action-btn {
          min-height: 44px;
          border-radius: 14px;
          font-weight: 800;
        }

        .admin-primary-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
        }

        .admin-primary-btn:hover {
          color: #fff;
        }

        .admin-inline-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-preview-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 20px;
        }

        .admin-preview-card {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #dbeafe;
          border-radius: 24px;
          padding: 20px;
        }

        .admin-preview-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .admin-preview-module {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 14px;
          background: #fff;
          margin-bottom: 12px;
        }

        .admin-preview-module-head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .admin-preview-video-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-preview-video-btn {
          width: 100%;
          text-align: left;
          border: 1px solid #dbeafe;
          background: #eff6ff;
          border-radius: 14px;
          padding: 10px 12px;
          font-weight: 600;
          color: #1e3a8a;
        }

        .admin-preview-video-btn.active {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-color: #60a5fa;
        }

        .admin-preview-player-wrap {
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid #dbeafe;
          background: #0f172a;
          margin-bottom: 14px;
        }

        .admin-preview-player {
          width: 100%;
          display: block;
          background: #000;
        }

        .admin-preview-fallback {
          border-radius: 18px;
          border: 1px dashed #cbd5e1;
          padding: 24px;
          text-align: center;
          color: #64748b;
          background: #f8fafc;
        }

        .admin-preview-quiz-card {
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 14px;
        }

        .admin-preview-quiz-option {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px 12px;
          background: #f8fafc;
          margin-bottom: 8px;
        }

        .admin-preview-quiz-option.correct {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-color: #86efac;
          color: #065f46;
          font-weight: 700;
        }

        .admin-list-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          height: 100%;
        }

        .admin-list-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .admin-list-text {
          color: #64748b;
          line-height: 1.8;
        }

        .admin-empty-card {
          border-radius: 24px;
          padding: 22px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        @keyframes adminFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .admin-hero-title {
            font-size: 1.95rem;
          }

          .admin-preview-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .admin-internships-page {
            padding: 22px 0;
          }

          .admin-hero-title {
            font-size: 1.7rem;
          }
        }
      `}</style>

      <div className="admin-internships-page py-4 py-lg-5">
        <div className="admin-internships-orb admin-internships-orb-1"></div>
        <div className="admin-internships-orb admin-internships-orb-2"></div>

        <div className="container admin-internships-shell">
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

          <div className="card admin-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="admin-chip">Internova Admin Control Center</div>
                  <h1 className="admin-hero-title">Admin Internship Manager</h1>
                  <p className="admin-hero-text">
                    Create, edit, preview, duplicate, import, export, and manage
                    internship programs from one premium admin workspace.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Programs</div>
                        <h4 className="admin-stat-value">{internships.length}</h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Mode</div>
                        <h4 className="admin-stat-value">
                          {editingId ? "Edit" : "Create"}
                        </h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Tools</div>
                        <h4 className="admin-stat-value">Import / Export</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card admin-glass-card border-0 rounded-5 overflow-hidden mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h3 className="admin-section-title">
                    {editingId ? "Edit Program" : "Create Program"}
                  </h3>
                  <p className="admin-section-subtitle mb-0">
                    Build a complete program with pricing, course content, unlock
                    schedule, and mini test structure.
                  </p>
                </div>

                <div className="admin-inline-actions">
                  <button
                    type="button"
                    className="btn btn-outline-dark admin-action-btn"
                    onClick={handleExportJson}
                  >
                    Export JSON
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary admin-action-btn"
                    onClick={handleImportClick}
                  >
                    Import JSON
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    style={{ display: "none" }}
                    onChange={handleImportJson}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="admin-label">Title</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="title"
                      value={formData.title}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="admin-label">Slug</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="slug"
                      value={formData.slug}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Branch</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="branch"
                      value={formData.branch}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Category</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="category"
                      value={formData.category}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Thumbnail URL</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="image"
                      value={formData.image}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="admin-label">Description</label>
                    <textarea
                      className="form-control admin-textarea"
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-sub-card mb-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="admin-mini-title mb-0">Durations & Pricing</h5>
                    <button
                      type="button"
                      className="btn btn-outline-dark admin-action-btn"
                      onClick={addDuration}
                    >
                      Add Duration
                    </button>
                  </div>

                  {formData.durations.map((duration, index) => (
                    <div className="row g-3 mb-3" key={index}>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control admin-input"
                          value={duration.label}
                          onChange={(e) =>
                            handleDurationChange(index, "label", e.target.value)
                          }
                          placeholder="Duration Label"
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="number"
                          className="form-control admin-input"
                          value={duration.price}
                          onChange={(e) =>
                            handleDurationChange(index, "price", e.target.value)
                          }
                          placeholder="Price"
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="number"
                          className="form-control admin-input"
                          value={duration.durationDays}
                          onChange={(e) =>
                            handleDurationChange(
                              index,
                              "durationDays",
                              e.target.value
                            )
                          }
                          placeholder="Days"
                        />
                      </div>
                      <div className="col-md-5">
                        <div className="admin-inline-actions">
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveDurationUp(index)}
                          >
                            ↑ Up
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveDurationDown(index)}
                          >
                            ↓ Down
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger admin-action-btn"
                            onClick={() => removeDuration(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-sub-card mb-4">
                  <h5 className="admin-mini-title">Course Rules</h5>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="admin-label">Required Progress %</label>
                      <input
                        type="number"
                        className="form-control admin-input"
                        name="requiredProgress"
                        value={formData.requiredProgress}
                        onChange={handleBasicChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="admin-label">Mini Test Unlock %</label>
                      <input
                        type="number"
                        className="form-control admin-input"
                        name="miniTestUnlockProgress"
                        value={formData.miniTestUnlockProgress}
                        onChange={handleBasicChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="admin-label">Mini Test Pass %</label>
                      <input
                        type="number"
                        className="form-control admin-input"
                        name="miniTestPassMarks"
                        value={formData.miniTestPassMarks}
                        onChange={handleBasicChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="admin-label">Unlock All Price</label>
                      <input
                        type="number"
                        className="form-control admin-input"
                        name="unlockAllPrice"
                        value={formData.unlockAllPrice}
                        onChange={handleBasicChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="certificateEnabled"
                          name="certificateEnabled"
                          checked={formData.certificateEnabled}
                          onChange={handleBasicChange}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="certificateEnabled"
                        >
                          Certificate Enabled
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleBasicChange}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="isActive"
                        >
                          Program Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-sub-card mb-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="admin-mini-title mb-0">Modules & Videos</h5>
                    <button
                      type="button"
                      className="btn btn-outline-dark admin-action-btn"
                      onClick={addModule}
                    >
                      Add Module
                    </button>
                  </div>

                  {formData.modules.map((module, index) => (
                    <div className="admin-sub-card mb-4" key={index}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <h6 className="fw-bold mb-0">Module {index + 1}</h6>
                        <div className="admin-inline-actions">
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveModuleUp(index)}
                          >
                            ↑ Up
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveModuleDown(index)}
                          >
                            ↓ Down
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger admin-action-btn"
                            onClick={() => removeModule(index)}
                          >
                            Remove Module
                          </button>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control admin-input"
                            placeholder="Module Title"
                            value={module.title}
                            onChange={(e) =>
                              handleModuleChange(index, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control admin-input"
                            placeholder="Module Description"
                            value={module.description}
                            onChange={(e) =>
                              handleModuleChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control admin-input"
                            placeholder="Unlock Day"
                            value={module.unlockDay}
                            onChange={(e) =>
                              handleModuleChange(
                                index,
                                "unlockDay",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control admin-input"
                            placeholder="Order"
                            value={module.order}
                            onChange={(e) =>
                              handleModuleChange(index, "order", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <h6 className="fw-bold mb-0">Videos</h6>
                        <button
                          type="button"
                          className="btn btn-outline-primary admin-action-btn"
                          onClick={() => addVideo(index)}
                        >
                          Add Video
                        </button>
                      </div>

                      {(module.videos || []).map((video, videoIndex) => (
                        <div className="row g-3 mb-3" key={videoIndex}>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder="Video Title"
                              value={video.title}
                              onChange={(e) =>
                                handleVideoChange(
                                  index,
                                  videoIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder="Video URL"
                              value={video.videoUrl}
                              onChange={(e) =>
                                handleVideoChange(
                                  index,
                                  videoIndex,
                                  "videoUrl",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder="Duration"
                              value={video.duration}
                              onChange={(e) =>
                                handleVideoChange(
                                  index,
                                  videoIndex,
                                  "duration",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="number"
                              className="form-control admin-input"
                              placeholder="Order"
                              value={video.order}
                              onChange={(e) =>
                                handleVideoChange(
                                  index,
                                  videoIndex,
                                  "order",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <div className="admin-inline-actions">
                              <button
                                type="button"
                                className="btn btn-outline-secondary admin-action-btn"
                                onClick={() => moveVideoUp(index, videoIndex)}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary admin-action-btn"
                                onClick={() => moveVideoDown(index, videoIndex)}
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger admin-action-btn"
                                onClick={() => removeVideo(index, videoIndex)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder="Video Description"
                              value={video.description}
                              onChange={(e) =>
                                handleVideoChange(
                                  index,
                                  videoIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="admin-sub-card mb-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="admin-mini-title mb-0">Quiz Questions</h5>
                    <button
                      type="button"
                      className="btn btn-outline-dark admin-action-btn"
                      onClick={addQuizQuestion}
                    >
                      Add Question
                    </button>
                  </div>

                  {formData.quiz.map((q, qIndex) => (
                    <div className="admin-sub-card mb-3" key={qIndex}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <h6 className="fw-bold mb-0">Question {qIndex + 1}</h6>
                        <div className="admin-inline-actions">
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveQuizUp(qIndex)}
                          >
                            ↑ Up
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary admin-action-btn"
                            onClick={() => moveQuizDown(qIndex)}
                          >
                            ↓ Down
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger admin-action-btn"
                            onClick={() => removeQuizQuestion(qIndex)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="admin-label">Question</label>
                        <input
                          type="text"
                          className="form-control admin-input"
                          value={q.question}
                          onChange={(e) =>
                            handleQuizChange(qIndex, "question", e.target.value)
                          }
                        />
                      </div>

                      <div className="row g-3">
                        {q.options.map((option, oIndex) => (
                          <div className="col-md-6" key={oIndex}>
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleQuizOptionChange(
                                  qIndex,
                                  oIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="admin-label">Correct Answer Index</label>
                        <select
                          className="form-select admin-select"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            handleQuizChange(
                              qIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn admin-action-btn admin-primary-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Internship"
                      : "Create Internship"}
                  </button>

                  <button
                    className="btn btn-outline-secondary admin-action-btn"
                    type="button"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card admin-glass-card border-0 rounded-5 overflow-hidden mb-4">
            <div className="card-body p-4 p-md-5">
              <h3 className="admin-section-title">Live Preview</h3>
              <p className="admin-section-subtitle">
                Preview course content, video flow, and quiz structure before saving.
              </p>

              <div className="admin-preview-grid">
                <div className="admin-preview-card">
                  <h4 className="admin-preview-title">
                    Course Preview: {formData.title || "Untitled Program"}
                  </h4>

                  {sortedModulesPreview.length > 0 ? (
                    sortedModulesPreview.map((module, moduleIndex) => (
                      <div className="admin-preview-module" key={moduleIndex}>
                        <div className="admin-preview-module-head">
                          <div>
                            <strong>
                              Module {module.order}: {module.title || "Untitled Module"}
                            </strong>
                            <div className="text-secondary small">
                              Unlock Day {module.unlockDay}
                            </div>
                          </div>
                          <span className="badge bg-light text-dark border rounded-pill">
                            {module.videos?.length || 0} Videos
                          </span>
                        </div>

                        <div className="admin-preview-video-list">
                          {(module.videos || []).map((video, videoIndex) => (
                            <button
                              type="button"
                              key={videoIndex}
                              className={`admin-preview-video-btn ${
                                previewVideo?.videoUrl === video.videoUrl
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => setPreviewVideo(video)}
                            >
                              {video.order}. {video.title || "Untitled Video"}{" "}
                              {video.duration ? `• ${video.duration}` : ""}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="admin-preview-fallback">
                      No modules available for preview yet.
                    </div>
                  )}
                </div>

                <div className="admin-preview-card">
                  <h4 className="admin-preview-title">Selected Video Preview</h4>

                  {previewVideo?.videoUrl ? (
                    <>
                      <div className="admin-preview-player-wrap">
                        <video
                          key={previewVideo.videoUrl}
                          controls
                          className="admin-preview-player"
                          src={previewVideo.videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      <h5 className="fw-bold mb-2">
                        {previewVideo.title || "Untitled Video"}
                      </h5>
                      <p className="text-secondary mb-2">
                        {previewVideo.description || "No description added yet."}
                      </p>
                      <div className="small text-dark">
                        Duration: <strong>{previewVideo.duration || "N/A"}</strong>
                      </div>
                    </>
                  ) : (
                    <div className="admin-preview-fallback">
                      Add a valid video URL to preview playback here.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="admin-preview-title">Quiz Preview</h4>

                {sortedQuizPreview.length > 0 ? (
                  sortedQuizPreview.map((q, qIndex) => (
                    <div className="admin-preview-quiz-card" key={qIndex}>
                      <h6 className="fw-bold mb-3">
                        Q{qIndex + 1}. {q.question}
                      </h6>

                      {(q.options || []).map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`admin-preview-quiz-option ${
                            q.correctAnswer === oIndex ? "correct" : ""
                          }`}
                        >
                          {option || `Option ${oIndex + 1}`}
                          {q.correctAnswer === oIndex ? "  • Correct Answer" : ""}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="admin-preview-fallback">
                    No quiz questions available for preview yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card admin-glass-card border-0 rounded-5 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <h3 className="admin-section-title">Existing Internships</h3>
              <p className="admin-section-subtitle">
                Review, edit, duplicate, export, or remove existing programs from your admin inventory.
              </p>

              <div className="row g-4">
                {internships.map((item) => (
                  <div className="col-md-6" key={item._id}>
                    <div className="admin-list-card">
                      <div className="card-body p-4">
                        <h4 className="admin-list-title">{item.title}</h4>
                        <p className="mb-1">
                          <strong>Branch:</strong> {item.branch}
                        </p>
                        <p className="mb-1">
                          <strong>Category:</strong> {item.category}
                        </p>
                        <p className="mb-1">
                          <strong>Durations:</strong> {item.durations?.length || 0}
                        </p>
                        <p className="mb-1">
                          <strong>Modules:</strong> {item.modules?.length || 0}
                        </p>
                        <p className="mb-1">
                          <strong>Quiz Questions:</strong> {item.quiz?.length || 0}
                        </p>
                        <p className="admin-list-text mb-3">
                          {item.description?.slice(0, 120)}...
                        </p>

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-dark admin-action-btn"
                            onClick={() => handleEdit(item._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-primary admin-action-btn"
                            onClick={() => handleDuplicate(item._id)}
                          >
                            Duplicate
                          </button>

                          <button
                            className="btn btn-danger admin-action-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {internships.length === 0 && (
                <div className="admin-empty-card mt-4">
                  <h5 className="fw-bold mb-2">No Internships Available</h5>
                  <p className="mb-0">
                    No internships have been created yet. Start by creating your
                    first internship program.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminInternships;