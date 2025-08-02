import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateQuestionText,
    removeQuestion,
    addQuestion,
    updateQuestionType,
    updateShortAnswer,
    selectQuestion
} from '../../redux/Slices/formSlice';

import ShortAnswer from '../QuestionTypes/ShortAnswer/ShortAnswer';
import LongAnswer from '../QuestionTypes/LongAnswer/LongAnswer';
import MultipleChoice from '../QuestionTypes/MultipleChoice/MultipleChoice';
import CheckboxType from '../QuestionTypes/CheckboxType/CheckboxType';
import DropdownType from '../QuestionTypes/DropdownType/DropdownType';
import FileUploadType from '../QuestionTypes/FileUploadType/FileUploadType';
import DateInputType from '../QuestionTypes/DateInputType/DateInputType';
import LinearScaleType from '../QuestionTypes/LinearScaleType/LinearScaleType';
import RatingType from '../QuestionTypes/RatingType/RatingType';

import './QuestionCardStyle.css';


const QuestionCard = ({ question, pageId, onOpenImageModal, onOpenVideoModal }) => {
    const dispatch = useDispatch();

    const { pages } = useSelector((state) => state.form);

    const currentPage = pages.find(p => p.pageId === pageId);
    const currentSection = currentPage?.sections?.find(s => s.id === question.sectionId);

    const selectedQuestionId = useSelector((state) => state.form.selectedQuestionId);

    const handleChange = (e) => {
        dispatch(updateQuestionText({ questionId: question.id, text: e.target.value }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && e.target.value.trim() === '') {
            e.preventDefault();
            dispatch(removeQuestion({ pageId, questionId: question.id }));
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            dispatch(addQuestion());
        }
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        dispatch(updateQuestionType({ pageId, questionId: question.id, newType }));
    };


    const handleSelect = () => {
        dispatch(selectQuestion(question.id));
    };

    /** Render input fields by type */
    const renderInputByType = () => {
        switch (question.type) {
            case 'Short Answer':
                return <ShortAnswer questionId={question.id} pageId={pageId} answerText={question.answerText || ''} />;

            case 'Long Answer':
                return <LongAnswer questionId={question.id} pageId={pageId} answerText={question.answerText || ''} />;

            case 'Multiple Choice':
                return question.options.map((option, index) => (
                    <MultipleChoice key={index} option={option} index={index} questionId={question.id} />
                ));

            case 'Checkbox':
                return question.options.map((option, index) => (
                    <CheckboxType key={index} option={option} index={index} questionId={question.id} />
                ));

            case 'Dropdown':
                return <DropdownType questionId={question.id} pageId={pageId} options={question.options} />;

            case 'File Upload':
                return <FileUploadType pageId={pageId} questionId={question.id} />;

            case 'Date':
                return <DateInputType pageId={pageId} questionId={question.id} value={question.dateValue} />;

            case 'Linear Scale':
                return <LinearScaleType pageId={pageId} questionId={question.id} data={question.linearScale} />;

            case 'Rating':
                return <RatingType pageId={pageId} questionId={question.id} data={question.rating} />;

            case 'Image':
                return (
                    <>
                        {question.imageUrl ? (
                            <div className="image-question">
                                <img src={question.imageUrl} alt="Uploaded" className="uploaded-image" />
                                <input
                                    type="text"
                                    placeholder="Write your answer here"
                                    className="answer-input"
                                    value={question.answerText || ''}
                                    onChange={(e) =>
                                        dispatch(updateShortAnswer({ pageId, questionId: question.id, answer: e.target.value }))
                                    }
                                />
                            </div>
                        ) : (
                            <>
                                <button onClick={onOpenImageModal}>Upload Image</button>
                                <input
                                    type="text"
                                    placeholder="Write your answer here"
                                    className="answer-input"
                                    value={question.answerText || ''}
                                    onChange={(e) =>
                                        dispatch(updateShortAnswer({ pageId, questionId: question.id, answer: e.target.value }))
                                    }
                                    style={{ marginTop: '10px' }}
                                />
                            </>
                        )}
                    </>
                );

            case 'Video':
                return (
                    <>
                        {question.videoUrl ? (
                            <div className="video-question">
                                <video controls className="uploaded-video">
                                    <source src={question.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <input
                                    type="text"
                                    placeholder="Write your answer here"
                                    className="answer-input"
                                    value={question.answerText || ''}
                                    onChange={(e) =>
                                        dispatch(updateShortAnswer({ pageId, questionId: question.id, answer: e.target.value }))
                                    }
                                />
                            </div>
                        ) : (
                            <>
                                <button onClick={onOpenVideoModal}>Upload Video</button>
                                <input
                                    type="text"
                                    placeholder="Write your answer here"
                                    className="answer-input"
                                    value={question.answerText || ''}
                                    onChange={(e) =>
                                        dispatch(updateShortAnswer({ pageId, questionId: question.id, answer: e.target.value }))
                                    }
                                    style={{ marginTop: '10px' }}
                                />
                            </>
                        )}
                    </>
                );

            case 'Text':
                return (
                    <textarea
                        placeholder="Enter text..."
                        value={question.answerText || ''}
                        onChange={(e) =>
                            dispatch(updateShortAnswer({ pageId, questionId: question.id, answer: e.target.value }))
                        }
                        className="text-question-area"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className={`question-card ${selectedQuestionId === question.id ? 'selected' : ''}`}
            onClick={handleSelect}
            style={{
                backgroundColor: question.bgColor || 'white',
            }}
        >
            <div className="question-content">
                <input
                    type="text"
                    value={question.questionText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="question-text"
                    placeholder="Enter your question here"
                />

                {renderInputByType()}
            </div>

            {/* Type dropdown (exclude Image & Video) */}
            {question.type !== 'Image' && question.type !== 'Video' && (
                <div className="question-type-dropdown">
                    <span className="dropdown-icon">⌵</span>
                    <select value={question.type} onChange={handleTypeChange}>
                        <option value="Short Answer">Short Answer</option>
                        <option value="Long Answer">Long Answer</option>
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="Checkbox">Checkbox</option>
                        <option value="Dropdown">Dropdown</option>
                        <option value="File Upload">File Upload</option>
                        <option value="Date">Date</option>
                        <option value="Linear Scale">Linear Scale</option>
                        <option value="Rating">Rating</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;




