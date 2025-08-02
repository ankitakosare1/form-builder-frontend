import React from 'react';
import './ShortAnswerStyle.css';
import { useDispatch } from 'react-redux';

import { updateAnswerText } from '../../../redux/Slices/formSlice';

const ShortAnswer = ({questionId, pageId, answerText}) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateAnswerText({
      pageId,
      questionId,
      text: e.target.value
    }));
  };

  return(
      <textarea className="short-answer" value={answerText} onChange={handleChange} />
  )
};

export default ShortAnswer;
