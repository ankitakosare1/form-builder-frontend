import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QuestionCard from '../QuestionCard/QuestionCard';
import ImageUploadModal from '../Image&VideoUploadModal/Image&VideoUploadModal';
import { updateImageQuestion, updateVideoQuestion, setConditionAnswer, setPageCondition } from '../../redux/Slices/formSlice';
import './PageContentStyle.css';

const PageContent = () => {
  const dispatch = useDispatch();
  const { pages, selectedPageId, conditionPages, conditionAnswers } = useSelector((state) => state.form);
  const page = pages.find((p) => p.pageId === selectedPageId);
  const isConditionMode = conditionPages[selectedPageId] || false;

  const [showModal, setShowModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [isConditionModalOpen, setConditionModalOpen] = useState(false);
  const [truePage, setTruePage] = useState("");
  const [falsePage, setFalsePage] = useState("");

  if (!page) return <div>No Page Selected</div>;


  const handleOpenModal = (question, type) => {
    setActiveQuestion(question);
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveQuestion(null);
    setModalType(null);
  };

  const handleUpload = (fileUrl) => {
    if (modalType === 'image') {
      dispatch(
        updateImageQuestion({
          pageId: page.pageId,
          questionId: activeQuestion.id,
          imageUrl: fileUrl,
        })
      );
    } else if (modalType === 'video') {
      dispatch(
        updateVideoQuestion({
          pageId: page.pageId,
          questionId: activeQuestion.id,
          videoUrl: fileUrl,
        })
      );
    }
    handleCloseModal();
  };

  // Render Condition Mode UI
  const renderConditionMode = () => (
    
    <div className="condition-mode">
      {page.questions.map((q) => (
        <div key={q.id} className="condition-question">
          <p>{q.questionText || "Untitled Question"}</p>
          {q.type === 'Dropdown' ? (
            <select
              className="condition-dropdown"
              value={conditionAnswers[q.id]?.[0] || ''}
              onChange={(e) => dispatch(setConditionAnswer({
                pageId: selectedPageId,
                questionId: q.id,
                answer: e.target.value,
                isMulti: false,
                checked: true,
              }))}
            >
              <option value="" disabled>Select an option</option>
              {q.options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
          ) : q.type === 'Date' ? (
            <input
              type="date"
              className="condition-date"
              value={conditionAnswers[q.id]?.[0] || ''}
              onChange={(e) => dispatch(setConditionAnswer({
                pageId: selectedPageId,
                questionId: q.id,
                answer: e.target.value,
                isMulti: false,
                checked: true,
              }))}
            />
          ) : (q.type === 'Short Answer' || q.type === 'Long Answer') ? (
            <textarea
              className="condition-textarea"
              value={conditionAnswers[q.id]?.[0] || ''}
              onChange={(e) => dispatch(setConditionAnswer({
                pageId: selectedPageId,
                questionId: q.id,
                answer: e.target.value,
                isMulti: false,
                checked: true,
              }))}
              rows={q.type === 'Long Answer' ? 5 : 2}
            />
          ) : (
            <div className="condition-options">
              {(q.options || []).map((opt, idx) => (
                <div key={idx} className="condition-option">
                  <label className="option-label">
                    <input type={q.type === 'Multiple Choice' ? 'radio' : 'checkbox'} disabled />
                    <span>{opt}</span>
                  </label>
                  <input
                    className="condition-circle"
                    type={q.type === 'Checkbox' ? 'checkbox' : 'radio'}
                    name={q.type === 'Checkbox' ? `condition-${q.id}-${idx}` : `condition-${q.id}`}
                    checked={conditionAnswers[q.id]?.includes(opt) || false}
                    onChange={(e) =>
                      dispatch(setConditionAnswer({
                        pageId: selectedPageId,
                        questionId: q.id,
                        answer: opt,
                        isMulti: q.type === 'Checkbox',
                        checked: e.target.checked,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )
          }
        </div>
      ))}
    </div>
  );

  // Ensure section.questions stays in order of page.questions
  const sortedSections = page.sections?.map(section => ({
    ...section,
    questions: section.questions
      .map(qId => page.questions.find(q => q.id === qId))
      .filter(Boolean)
      .sort((a, b) => page.questions.findIndex(q => q.id === a.id) - page.questions.findIndex(q => q.id === b.id))
  })) || [];

  //Track un-sectioned questions (render separately)
  const unsectionedQuestions = page.questions.filter(q => !q.sectionId);

  return (
    <div className="page-content">
      {isConditionMode ? (
        <>
          {renderConditionMode()}
          {/* Show Add Condition Button ONLY in Condition Mode */}
          <div className="add-condition-footer">
            <button className="add-condition-btn" onClick={() => setConditionModalOpen(true)}>
              Add Condition
            </button>
          </div>



          {isConditionModalOpen && (
            <div className="modal-overlay">
              <div className="condition-modal">
                <button className="close-btn" onClick={() => setConditionModalOpen(false)}> &times; </button>
                <p>Select Page</p>
                <p>If the conditions are met, it will lead the user to the page you’ve selected.</p>

                {/* TRUE Dropdown */}
                <label>Select, if it's true:</label>
                <select
                  value={truePage}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setTruePage(selected);

                    // Clear FALSE if it matches new TRUE
                    if (selected === falsePage) {
                      setFalsePage("");
                    }
                  }}
                >
                  <option value="">Select Page</option>
                  {pages
                    .filter(
                      (p) =>
                        p.pageId !== selectedPageId &&
                        p.pageId !== falsePage // Remove selected FALSE page dynamically
                    )
                    .map((p) => (
                      <option key={p.pageId} value={p.pageId}>
                        {p.pageTitle}
                      </option>
                    ))}
                </select>

                {/* FALSE Dropdown */}
                <label>Select, if it's false:</label>
                <select
                  value={falsePage}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setFalsePage(selected);

                    // Clear TRUE if it matches new FALSE
                    if (selected === truePage) {
                      setTruePage("");
                    }
                  }}
                >
                  <option value="">Select Page</option>
                  {pages
                    .filter(
                      (p) =>
                        p.pageId !== selectedPageId &&
                        p.pageId !== truePage // Remove selected TRUE page dynamically
                    )
                    .map((p) => (
                      <option key={p.pageId} value={p.pageId}>
                        {p.pageTitle}
                      </option>
                    ))}
                </select>

                <button
                  className="continue-btn"
                  onClick={() => {
                    dispatch(setPageCondition({ selectedPageId, truePage, falsePage }));
                    setConditionModalOpen(false);
                  }}
                  disabled={!truePage || !falsePage} // Disable until both selected
                >
                  Continue
                </button>
              </div>
            </div>
          )}




        </>
      ) : (
        <>
          {/* Render Sections */}
          {sortedSections.map((section, sectionIndex) => (
            <div
              key={section.sectionId}
              style={{
                backgroundColor: section.bgColor || '#f5f5f5',
              }}
            >

              {section.questions.map((q, index) => (
                <QuestionCard
                  key={q.id}
                  question={{
                    ...q,
                    displayNumber: `${sectionIndex + 1}.${index + 1}`,
                    bgColor: section.bgColor || '#f5f5f5',
                  }}
                  pageId={page.pageId}
                  onOpenImageModal={() => handleOpenModal(q, 'image')}
                  onOpenVideoModal={() => handleOpenModal(q, 'video')}
                />
              ))}
            </div>
          ))}

          {/* Render Questions without sections */}
          {unsectionedQuestions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={{ ...q, displayNumber: index + 1 }}
              pageId={page.pageId}
              onOpenImageModal={() => handleOpenModal(q, 'image')}
              onOpenVideoModal={() => handleOpenModal(q, 'video')}
            />
          ))}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="page-blur-overlay"></div>
          <ImageUploadModal
            type={modalType}
            onClose={handleCloseModal}
            onUpload={handleUpload}
          />
        </>
      )}


    </div>
  );
};

export default PageContent;




