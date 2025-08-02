import React from 'react';
import { useDispatch } from 'react-redux';
import { updateDateAnswer } from '../../../redux/Slices/formSlice';
import './DateInputTypeStyle.css';

const DateInputType = ({ pageId, questionId, value }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateDateAnswer({
      pageId,
      questionId,
      value: e.target.value
    }));
  };

  return (
    <div className="date-input-wrapper">
      <input
        type="date"
        className="date-input"
        value={value || ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default DateInputType;




