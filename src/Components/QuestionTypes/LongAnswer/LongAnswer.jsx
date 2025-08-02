import React from 'react';
import './LongAnswerStyle.css';
import { useDispatch } from 'react-redux';
import { updateAnswerText } from '../../../redux/Slices/formSlice';

const LongAnswer = ({ questionId, pageId, answerText }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateAnswerText({
      pageId,
      questionId,
      text: e.target.value
    }));
  };

  return (
    <textarea
      className="long-answer"
      value={answerText}
      onChange={handleChange}
    />
  );
};

export default LongAnswer;

