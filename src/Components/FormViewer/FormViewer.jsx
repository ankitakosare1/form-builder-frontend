import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { getSharedForm } from "../../api/form";
import { submitResponse } from "../../api/form";

import "../FormPreview/FormPreviewStyle.css";
import { setLastAnsweredPage } from "../../redux/Slices/formSlice";
import { setConditionAnswer } from "../../redux/Slices/formSlice";

const FormViewer = () => {
  const dispatch = useDispatch();
  const { shareLink } = useParams();
  const navigate = useNavigate();

  const lastAnsweredPageId = useSelector((state) => state.form.lastAnsweredPageId);
  const conditionAnswers = useSelector((state) => state.form.conditionAnswers);

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const reduxPageConditions = useSelector((state) => state.form.pageConditions);

  // Fetch form & always start from first condition page
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getSharedForm(shareLink);
        if (res.success && res.form) {
          const fetchedForm = res.form;

          // Store pageConditions in Redux
          if (fetchedForm.pageConditions) {
            dispatch({ type: "form/setPageConditions", payload: fetchedForm.pageConditions });
          }

          let startPageIndex = 0;

          // Always load the first condition page if any exist
          if (fetchedForm.pageConditions && Object.keys(fetchedForm.pageConditions).length > 0) {
            const firstConditionPageId = Object.keys(fetchedForm.pageConditions)[0];
            console.log("First condition page ID:", firstConditionPageId);

            const idx = fetchedForm.pages.findIndex((p) => String(p.pageId) === String(firstConditionPageId));
            if (idx !== -1) startPageIndex = idx;
            console.log("Starting from condition page index:", startPageIndex);
          }

          setForm(fetchedForm);
          setCurrentPageIndex(startPageIndex);


        }
      } catch (err) {
        console.error("Failed to fetch form:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [shareLink, dispatch]);


  const handleAnswerChange = (qId, value, isMulti = false, checked = false) => {
    const currentPageId = form.pages[currentPageIndex].pageId;

    // Mark the current page as last answered
    dispatch(setLastAnsweredPage(currentPageId));

    // Update local answers state
    setAnswers((prev) => {
      if (isMulti) {
        const current = prev[qId] || [];
        const updatedAnswers = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
        return { ...prev, [qId]: updatedAnswers };
      }
      return { ...prev, [qId]: value };
    });

    // Update condition answer in Redux
    dispatch(
      setConditionAnswer({
        pageId: currentPageId,
        questionId: qId,
        answer: value,
        isMulti,
        checked,
      })
    );
  };


  const handleFileUpload = (qId, file) => {
    dispatch(setLastAnsweredPage(form.pages[currentPageIndex].pageId)); // Track answered page
    setAnswers((prev) => ({ ...prev, [qId]: file }));
  };

  const handleRating = (qId, value) => {
    dispatch(setLastAnsweredPage(form.pages[currentPageIndex].pageId)); // Track answered page
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };


  const handleSubmit = async () => {
    try {
      const currentPage = form.pages[currentPageIndex];

      // Step 1: Submit user response
      const res = await submitResponse({
        formId: form._id,
        currentPageId: currentPage.pageId,
        userAnswers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      });

      console.log("Page Conditions Object:", form.pageConditions);
      console.log("Current Page ID:", currentPage.pageId);


      if (res.success) {
        // Step 2: If backend provides redirectPage
        if (res.redirectPage) {
          const nextPageIndex = form.pages.findIndex(
            (p) => String(p.pageId) === String(res.redirectPage)
          );
          if (nextPageIndex !== -1 &&
            String(currentPage.pageId) !== String(res.redirectPage)) {
            console.log("Redirecting to backend-provided page:", res.redirectPage);
            setCurrentPageIndex(nextPageIndex);
            return; // Stop here (do not show Thank You yet)
          }
        }

        // Step 3: If no backend redirect, check condition manually
        const condition = form.pageConditions?.[String(currentPage.pageId)];
        if (condition) {
          const givenAnswer = answers[condition.questionId];
          console.log("Checking condition on submit:", { givenAnswer, condition });

          if (givenAnswer !== undefined) {
            const targetPageId =
              givenAnswer === condition.expectedAnswer
                ? condition.truePage
                : condition.falsePage;

            const targetIndex = form.pages.findIndex(
              (p) => String(p.pageId) === String(targetPageId)
            );
            console.log("Redirecting to condition target page:", targetPageId, "Index:", targetIndex);

            if (String(currentPage.pageId) === String(targetPageId)) {
              console.log("Already on target page, skipping condition redirect.");
            } else {
              const targetIndex = form.pages.findIndex(
                (p) => String(p.pageId) === String(targetPageId)
              );
              console.log(
                "Redirecting to condition target page:",
                targetPageId,
                "Index:",
                targetIndex
              );

              if (targetIndex !== -1) {
                setCurrentPageIndex(targetIndex);
                return;
              }
            }
          }
        }

        // Step 4: If no redirect or condition navigation, mark as submitted
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit response:", err);
      setSubmitted(true);
    }
  };



  if (loading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  // Show Thank You screen after submit if no redirect page
  if (submitted) {
    return (
      <div className="form-preview">
        <div className="form-preview-wrapper">
          <h2 className="preview-title"> Thanks for filling the form!</h2>
          <p style={{ color: "white" }}>Your response has been successfully recorded.</p>
        </div>
      </div>
    );
  }

  const currentPage = form.pages[currentPageIndex];
  const unsectionedQuestions = currentPage.questions?.filter((q) => !q.sectionId) || [];

  //Detect condition page & if condition answered
  const currentCondition = form.pageConditions?.[currentPage.pageId];
  const isConditionPage = !!currentCondition;
  const isConditionAnswered = currentCondition
    ? answers[currentCondition.questionId] !== undefined && answers[currentCondition.questionId] !== ""
    : true;

  return (
    <div className="form-preview">
      <div className="form-preview-wrapper">

        {isConditionPage && (
          <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #ddd" }}>
            Please answer this question to continue.
          </div>
        )}

        {/* Render only the current page */}
        <div>
          <h2 className="preview-title">{currentPage.pageTitle}</h2>

          {/* Render Sections */}
          {currentPage.sections?.map((section) => {
            const sectionQuestions = currentPage.questions?.filter((q) => q.sectionId === section.sectionId);

            return (
              <div
                key={section.sectionId}
                className="preview-section"
                style={{ backgroundColor: section.bgColor || "#fff" }}
              >
                {sectionQuestions.map((q) =>
                  q.bgColor ? (
                    <div
                      key={q.id}
                      className="preview-section"
                      style={{
                        backgroundColor: q.bgColor,
                        margin: "0 -16px",
                        borderRadius: "10px",
                      }}
                    >
                      <QuestionInput q={q} answers={answers} onChange={handleAnswerChange} onFile={handleFileUpload} onRate={handleRating} />
                    </div>
                  ) : (
                    <QuestionInput key={q.id} q={q} answers={answers} onChange={handleAnswerChange} onFile={handleFileUpload} onRate={handleRating} />
                  )
                )}
              </div>
            );
          })}

          {/* Render Unsectioned Questions */}
          {unsectionedQuestions.length > 0 && (
            <div className="preview-section" style={{ backgroundColor: "#fff" }}>
              {unsectionedQuestions.map((q) =>
                q.bgColor ? (
                  <div
                    key={q.id}
                    className="preview-section"
                    style={{
                      backgroundColor: q.bgColor,
                      margin: "-16px -16px 0 -16px",
                      borderRadius: "10px",
                    }}
                  >
                    <QuestionInput q={q} answers={answers} onChange={handleAnswerChange} onFile={handleFileUpload} onRate={handleRating} />
                  </div>
                ) : (
                  <QuestionInput key={q.id} q={q} answers={answers} onChange={handleAnswerChange} onFile={handleFileUpload} onRate={handleRating} />
                )
              )}
            </div>
          )}
        </div>

        {/* Disable submit until condition answered */}
        <button className="back-to-edit" onClick={handleSubmit} >
          "Submit"
        </button>
      </div>
    </div>
  );
};

/* Question Input Component (Active fields for answering) */
const QuestionInput = ({ q, answers, onChange, onFile, onRate }) => (
  <div className="preview-question">
    <label className="question-label">{q.questionText}</label>

    {q.type === "Short Answer" && (
      <textarea
        className="preview-textarea short-answer"
        placeholder="Short answer"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value)}
      />
    )}

    {q.type === "Long Answer" && (
      <textarea
        className="preview-textarea long-answer"
        placeholder="Long answer"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value)}
      />
    )}

    {q.type === "Text" && (
      <textarea
        className="preview-textarea"
        placeholder="Enter text"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value)}
      />
    )}

    {q.type === "Multiple Choice" && (
      <div className="preview-options">
        {q.options?.map((opt, i) => (
          <label key={i} className="preview-option">
            <input
              type="radio"
              name={q.id}
              checked={answers[q.id] === opt}
              onChange={() => onChange(q.id, opt)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>
    )}

    {q.type === "Checkbox" && (
      <div className="preview-options">
        {q.options?.map((opt, i) => (
          <label key={i} className="preview-option">
            <input
              type="checkbox"
              checked={answers[q.id]?.includes(opt) || false}
              onChange={(e) => onChange(q.id, opt, true, e.target.checked)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>
    )}

    {q.type === "Dropdown" && (
      <select
        className="preview-dropdown"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value)}
      >
        <option value="">Select an option</option>
        {q.options?.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )}

    {q.type === "File Upload" && (
      <div className="preview-upload-wrapper">
        <input type="file" onChange={(e) => onFile(q.id, e.target.files[0])} />
      </div>
    )}

    {q.type === "Image" && (
      <div className="preview-upload-wrapper">
        <input type="file" accept="image/*" onChange={(e) => onFile(q.id, e.target.files[0])} />
      </div>
    )}

    {q.type === "Video" && (
      <div className="preview-upload-wrapper">
        <input type="file" accept="video/*" onChange={(e) => onFile(q.id, e.target.files[0])} />
      </div>
    )}

    {q.type === "Date" && (
      <input
        type="date"
        className="preview-date"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value)}
      />
    )}

    {q.type === "Linear Scale" && (
      <div className="preview-linear-scale linear-scale-wrapper">
        <div className="scale-input-row">
          <div className="scale-box">{q.scale?.minLabel || "Scale Start"}</div>
          <div className="scale-box">{q.scale?.maxLabel || "Scale End"}</div>
        </div>
        <div className="slider-row">
          <span className="scale-edge">{q.scale?.min || 1}</span>
          <input
            type="range"
            min={q.scale?.min || 1}
            max={q.scale?.max || 10}
            value={answers[q.id] || q.scale?.min || 1}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="scale-slider"
          />
          <span className="scale-edge">{q.scale?.max || 10}</span>
        </div>
        <div className="scale-value">{answers[q.id] || q.scale?.min || 1}</div>
      </div>
    )}

    {q.type === "Rating" && (
      <div className="preview-rating-wrapper">
        <div className="rating-stars">
          {Array.from({ length: q.rating?.count || 5 }).map((_, i) => (
            <span
              key={i}
              className={`star ${i < (answers[q.id] || 0) ? "filled" : ""}`}
              onClick={() => onRate(q.id, i + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default FormViewer;

