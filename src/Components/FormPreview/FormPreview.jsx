import React from 'react';
import { useSelector } from 'react-redux';
import './FormPreviewStyle.css';

const FormPreview = ({ onBack }) => {
    const pages = useSelector((state) => state.form.pages);
    const selectedPageId = useSelector((state) => state.form.selectedPageId);
    const selectedPage = pages.find((p) => p.pageId === selectedPageId);

    // Questions without any section
    const unsectionedQuestions = selectedPage?.questions?.filter((q) => !q.sectionId) || [];

    return (
        <div className="form-preview">
            <div className="form-preview-wrapper">
                <h2 className="preview-title">{selectedPage?.pageTitle || 'Title'}</h2>

                <div className="preview-sections">
                    {/* Render Sectioned Questions */}
                    {selectedPage?.sections?.map((section) => {
                        const sectionQuestions = selectedPage?.questions?.filter(
                            (q) => q.sectionId === section.sectionId
                        );

                        return (
                            <div
                                key={section.sectionId}
                                className="preview-section"
                                style={{ backgroundColor: section.bgColor || '#fff' }}
                            >
                                {sectionQuestions.map((q) =>
                                    q.bgColor ? (
                                        // Render bgColor questions FULL-WIDTH like sections
                                        <div
                                            key={q.id}
                                            className="preview-section"
                                            style={{
                                                backgroundColor: q.bgColor,
                                                margin: '0 -16px',
                                                borderRadius: '10px',
                                            }}
                                        >
                                            <QuestionPreview q={q} />
                                        </div>
                                    ) : (
                                        <QuestionPreview key={q.id} q={q} />
                                    )
                                )}
                            </div>
                        );
                    })}

                    {/* Render Questions Without Sections */}
                    {unsectionedQuestions.length > 0 && (
                        <div className="preview-section" style={{ backgroundColor: '#fff' }}>
                            {unsectionedQuestions.map((q) =>
                                q.bgColor ? (
                                    <div
                                        key={q.id}
                                        className="preview-section"
                                        style={{
                                            backgroundColor: q.bgColor,
                                            margin: '-16px -16px 0 -16px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <QuestionPreview q={q} />
                                    </div>
                                ) : (
                                    <QuestionPreview key={q.id} q={q} />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Back Button */}
            <button className="back-to-edit" onClick={onBack}>
                Back to Edit
            </button>
        </div>
    );
};

// Question Preview Component
const QuestionPreview = ({ q }) => (
    <div className="preview-question">
        <label className="question-label">{q.questionText}</label>

        {/* Short Answer */}
        {q.type === 'Short Answer' && (
            <textarea className="preview-textarea short-answer" placeholder="Short answer" disabled />
        )}

        {/* Long Answer */}
        {q.type === 'Long Answer' && (
            <textarea className="preview-textarea long-answer" placeholder="Long answer" disabled />
        )}

        {/* Text Input */}
        {q.type === 'Text' && (
            <textarea className="preview-textarea" placeholder="Short answer" disabled />
        )}

        {/* Multiple Choice */}
        {q.type === 'Multiple Choice' && (
            <div className="preview-options">
                {q.options?.map((opt, i) => (
                    <label key={i} className="preview-option">
                        <input type="radio" disabled /> {opt}
                    </label>
                ))}
            </div>
        )}

        {/* Checkbox */}
        {q.type === 'Checkbox' && (
            <div className="preview-options">
                {q.options?.map((opt, i) => (
                    <label key={i} className="preview-option">
                        <input type="checkbox" disabled /> {opt}
                    </label>
                ))}
            </div>
        )}

        {/* Dropdown */}
        {q.type === 'Dropdown' && (
            <select className="preview-dropdown" disabled>
                <option value="">Select an option</option>
                {q.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        )}

        {/* File Upload */}
        {q.type === 'File Upload' && (
            <div className="preview-upload-wrapper">
                <button className="preview-upload-btn" disabled>
                    Upload File
                </button>
            </div>
        )}

        {/* Image Upload */}
        {q.type === 'Image' && (
            <div className="preview-upload-wrapper">
                <button className="preview-upload-btn" disabled>
                    Upload Image
                </button>
            </div>
        )}

        {/* Video Upload */}
        {q.type === 'Video' && (
            <div className="preview-upload-wrapper">
                <button className="preview-upload-btn" disabled>
                    Upload Video
                </button>
            </div>
        )}

        {/* Date Picker */}
        {q.type === 'Date' && (
            <input
                type="date"
                className="preview-date"
            />
        )}

        {/* Linear Scale */}
        {q.type === 'Linear Scale' && (
            <div className="preview-linear-scale linear-scale-wrapper">
                {/* Static Labels */}
                <div className="scale-input-row">
                    <div className="scale-box">{q.scale?.minLabel || 'Scale Starting'}</div>
                    <div className="scale-box">{q.scale?.maxLabel || 'Scale Ending'}</div>
                </div>

                {/* Slider */}
                <div className="slider-row">
                    <span className="scale-edge">{q.scale?.min || 1}</span>
                    <input
                        type="range"
                        min={q.scale?.min || 1}
                        max={q.scale?.max || 10}
                        defaultValue={q.scale?.selected || q.scale?.min || 1}
                        className="scale-slider"
                        onChange={() => { }} // Preview only, no Redux update
                    />
                    <span className="scale-edge">{q.scale?.max || 10}</span>
                </div>

                {/* Selected Value */}
                <div className="scale-value">{q.scale?.selected || q.scale?.min || 1}</div>
            </div>
        )}

        {q.type === 'Rating' && (
            <div className="preview-rating-wrapper">
                {/* Stars Display */}
                <div className="rating-stars">
                    {Array.from({ length: q.rating?.count || 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`star ${i < (q.rating?.selected || 0) ? 'filled' : ''}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
        )}




    </div>
);

export default FormPreview;





