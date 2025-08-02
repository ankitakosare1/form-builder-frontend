import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRating } from '../../../redux/Slices/formSlice';
import './RatingTypeStyle.css';

const RatingType = ({ pageId, questionId }) => {
  const dispatch = useDispatch();

  const question = useSelector(state =>
    state.form.pages
      .find(p => p.pageId === pageId)
      ?.questions.find(q => q.id === questionId)
  );

  const rating = question?.rating || { selected: 0, count: 5 };

  const handleStarClick = (index) => {
    dispatch(updateRating({
      pageId,
      questionId,
      field: 'selected',
      value: index + 1,
    }));
  };

  const handleStarCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      dispatch(updateRating({
        pageId,
        questionId,
        field: 'count',
        value,
      }));

      if (rating.selected > value) {
        dispatch(updateRating({
          pageId,
          questionId,
          field: 'selected',
          value: 0,
        }));
      }
    }
  };

  return (
    <div className="rating-wrapper">
      <div className="rating-content">
        <div className="stars">
          {[...Array(rating.count)].map((_, idx) => (
            <span
              key={idx}
              className={`star ${idx < rating.selected ? 'filled' : ''}`}
              onClick={() => handleStarClick(idx)}
            >
              ★
            </span>
          ))}
        </div>
        <div className="star-count-box">
          <label htmlFor={`starCount-${questionId}`}>Star Count:</label>
          <input
            type="number"
            id={`starCount-${questionId}`}
            min="1"
            max="10"
            value={rating.count}
            onChange={handleStarCountChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingType;





