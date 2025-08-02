import React from 'react'
import { useDispatch } from 'react-redux'
import { updateOption, addOption, removeOption } from '../../redux/Slices/formSlice'

import './OptionInputStyle.css'

const OptionInput = ({questionId, option, index}) => {
    const dispatch = useDispatch();

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            dispatch(addOption({ questionId }));
        }
        if(e.key === 'Backspace' && option === ''){
            dispatch(removeOption({ questionId, optionIndex: index }));
        }
    };

  return (
    <div className='option-input-container'>
        <input type='text' 
        value={option} 
        onChange={(e) => dispatch(updateOption({questionId, optionIndex: index, value: e.target.value}))}
        onKeyDown={handleKeyDown}
        />
    </div>
  );
};

export default OptionInput;
