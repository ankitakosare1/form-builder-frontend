import React from 'react';
import { useDispatch } from 'react-redux';
import { updateOption, addOption, removeOption } from '../../../redux/Slices/formSlice';
import './DropdownTypeStyle.css';

const DropdownType = ({ questionId, options, pageId }) => {
  const dispatch = useDispatch();

  const handleChange = (e, index) => {
    dispatch(updateOption({ questionId, optionIndex: index, value: e.target.value }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addOption({ questionId }));
    }

    if (e.key === 'Backspace' && e.target.value === '') {
      e.preventDefault();
      dispatch(removeOption({ pageId, questionId, index }));
    }
  };

  return (
    <div className='dropdown-option-group'>
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="dropdown-option"
        />
      ))}
    </div>
  );
};

export default DropdownType;
