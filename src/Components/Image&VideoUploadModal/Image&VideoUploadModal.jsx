import React, { useState } from 'react';
import './Image&VideoUploadModalStyle.css';

const ImageUploadModal = ({ onClose, onUpload, type }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    onUpload(imageUrl);
    onClose();
  };

  return (
    <div className="modal-wrapper" >

      <div className="modal-container">
        <div className="modal-header">
          <h2>Upload</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {file && <p className="file-name">File: {file.name}</p>}

        <div className="upload-box">
          <input 
            type="file" 
            accept={type === 'video' ? 'video/*' : 'image/*'}  
            onChange={handleFileChange} 
            id="fileInput" 
            className="hidden-input"
          />
          <label htmlFor="fileInput" className="upload-label">
            Drag & drop files to upload
          </label>
          <p className="upload-subtext">Consider up to 25 MB per image</p>
          <p className="or-text">or</p>
          <label htmlFor="fileInput" className="browse-btn">Browse files</label>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className={`upload-btn ${!file ? 'disabled' : ''}`} 
            onClick={handleUpload} 
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;




