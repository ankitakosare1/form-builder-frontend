import React from 'react';
import { useDispatch } from 'react-redux';
import { updateLinearScale } from '../../../redux/Slices/formSlice';
import './LinearScaleTypeStyle.css';

const LinearScaleType = ({ pageId, questionId, data }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateLinearScale({
      pageId,
      questionId,
      field: 'selected',
      value: Number(e.target.value)
    }));
  };

  return (
    <div className="linear-scale-wrapper">
      {/* Static Display Boxes */}
      <div className="scale-input-row">
        <div className="scale-box-wrapper">
          <div className="scale-box static-box">Scale Starting</div>
        </div>
        <div className="scale-box-wrapper">
          <div className="scale-box static-box">Scale Ending</div>
        </div>
      </div>

      {/* Slider */}
      <div className="slider-row">
        <span className="scale-edge">{data.min}</span>
        <input
          type="range"
          min={data.min}
          max={data.max}
          value={data.selected}
          onChange={handleChange}
          className="scale-slider"
        />
        <span className="scale-edge">{data.max}</span>
      </div>

      {/* Selected Value */}
      <div className="scale-value">
        {data.selected}
      </div>
    </div>
  );
};

export default LinearScaleType;



