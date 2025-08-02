import React from 'react';
import { updateOption, addOption, removeOption } from '../../../redux/Slices/formSlice';

import './CheckboxTypeStyle.css';
import { useDispatch } from 'react-redux';

const CheckboxType = ({ option, index, questionId }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateOption({
      questionId,
      optionIndex: index,
      value: e.target.value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addOption({ questionId }));
    }

    if (e.key === 'Backspace' && e.target.value === '') {
      e.preventDefault();
      dispatch(removeOption({ questionId, index }));
    }
  };

  return (
    <div className="option-row">
      <input type="checkbox" disabled />
      <input
        type="text"
        value={option}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="option-input"
      />
    </div>
  );
};

export default CheckboxType;

