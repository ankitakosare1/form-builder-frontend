import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFileUploadSettings } from '../../../redux/Slices/formSlice';
import './FileUploadTypeStyle.css';

const FileUploadType = ({ pageId, questionId }) => {
  const dispatch = useDispatch();

  const question = useSelector((state) => {
    const page = state.form.pages.find((p) => p.pageId === pageId);
    return page?.questions.find((q) => q.id === questionId);
  });

  const handleFileTypeToggle = (type) => {
    const updatedTypes = question.fileTypes.includes(type)
      ? question.fileTypes.filter((t) => t !== type)
      : [...question.fileTypes, type];

    dispatch(updateFileUploadSettings({ pageId, questionId, field: 'fileTypes', value: updatedTypes }));
  };

  return (
    <div className="file-upload-wrapper">
      <div className="upload-row">
        <label className="upload-label">Number of Files:</label>
        <input
          type="number"
          className="upload-input"
          value={question.maxFiles || ''}
          onChange={(e) =>
            dispatch(
              updateFileUploadSettings({
                pageId,
                questionId,
                field: 'maxFiles',
                value: parseInt(e.target.value),
              })
            )
          }
        />

        <div className="upload-options">
          {['image', 'pdf', 'ppt', 'document'].map((type) => (
            <label key={type} className="upload-checkbox">
              {type}
              <input
                type="checkbox"
                checked={question.fileTypes.includes(type)}
                onChange={() => handleFileTypeToggle(type)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="upload-row">
        <label className="upload-label">Max File Size:</label>
        <input
          type="text"
          className="upload-input"
          value={question.maxFileSize || ''}
          onChange={(e) =>
            dispatch(
              updateFileUploadSettings({
                pageId,
                questionId,
                field: 'maxFileSize',
                value: e.target.value,
              })
            )
          }
        />

        <div className="upload-options">
          {['video', 'zip', 'audio', 'spreadsheet'].map((type) => (
            <label key={type} className="upload-checkbox">
              {type}
              <input
                type="checkbox"
                checked={question.fileTypes.includes(type)}
                onChange={() => handleFileTypeToggle(type)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploadType;


