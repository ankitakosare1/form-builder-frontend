import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, addImageQuestion, addVideoQuestion, updateQuestionBgColor, addSection, updateSectionColor, setShowCondition, addTextQuestion } from '../../redux/Slices/formSlice';
import './RightPanelStyle.css';

import PlusIcon from '../../assets/PlusIcon.png';
import AddText from '../../assets/AddText.png'
import AddCondition from '../../assets/AddCondition.png'
import AddImage from '../../assets/AddImage.png'
import Video from '../../assets/Video.png'
import AddSections from '../../assets/AddSections.png'

const RightPanel = ({ setShowFlow }) => {
  const dispatch = useDispatch();

  const { selectedPageId, selectedQuestionId, pages } = useSelector((state) => state.form);

  const [bgColor, setBgColor] = useState('#B6B6B6');
  const [bgOpacity, setBgOpacity] = useState(1);
  const [sectionColor, setSectionColor] = useState('#B6B6B6');
  const [sectionOpacity, setSectionOpacity] = useState(1);

  const hexToRgba = (hex, opacity) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleBgColorChange = (e) => {
    const color = e.target.value;
    setBgColor(color);
    document.documentElement.style.setProperty('--page-bg-color', hexToRgba(color, bgOpacity));
  };

  const handleBgOpacityChange = (e) => {
    const opacity = parseFloat(e.target.value);
    setBgOpacity(opacity);
    document.documentElement.style.setProperty('--page-bg-color', hexToRgba(bgColor, opacity));
  };

  const handleSectionColorChange = (e) => {
    const color = e.target.value;
    setSectionColor(color);
    document.documentElement.style.setProperty('--section-bg-color', hexToRgba(color, sectionOpacity));
  };

  const handleSectionOpacityChange = (e) => {
    const opacity = parseFloat(e.target.value);
    setSectionOpacity(opacity);
    document.documentElement.style.setProperty('--section-bg-color', hexToRgba(sectionColor, opacity));
  };

  const handleQuestionBgChange = (e) => {
    const color = e.target.value;
    if (selectedQuestionId) {
      dispatch(updateQuestionBgColor({
        pageId: selectedPageId,
        questionId: selectedQuestionId,
        color
      }));
    }
  };

  const handleSectionColorUpdate = (e) => {
    const color = e.target.value;
    setSectionColor(color);

    const currentPage = pages.find((p) => p.pageId === selectedPageId);
    if (!currentPage) return;

    const currentQuestion = currentPage.questions.find((q) => q.id === selectedQuestionId);
    if (!currentQuestion?.sectionId) return;

    dispatch(updateSectionColor({
      pageId: selectedPageId,
      sectionId: currentQuestion.sectionId,
      color,
    }));
  };

  const handleAddCondition = () => {
    if (!selectedPageId) return;
    dispatch(setShowCondition(selectedPageId));
  };

  return (
    <div className='right-panel'>
      <div className='right-panel-content'>
        <div className='action-buttons'>
          <button onClick={() => dispatch(addQuestion())}><img src={PlusIcon} alt='Add Question' />Add Question</button>
          <button onClick={() => dispatch(addTextQuestion())}><img src={AddText} alt='Add Text' />Add Text</button>
          <button onClick={(e) => {
            e.stopPropagation();
            handleAddCondition();
          }}><img src={AddCondition} alt='Add Condition' />Add Condition</button>
          <button onClick={() => dispatch(addImageQuestion())}><img src={AddImage} alt='Add Image' />Add Image</button>
          <button onClick={() => dispatch(addVideoQuestion())}><img src={Video} alt='Add Video' />Add Video</button>
          <button onClick={() => dispatch(addSection({
            pageId: selectedPageId,
            questionId: selectedQuestionId,
            sectionColor: sectionColor
          }))}><img src={AddSections} alt='Add Sections' />Add Sections</button>
        </div>

        <div className='color-picker-group'>

          <div className='color-picker'>
            <p>Background Color</p>
            <div className='color-control'>
              <input
                type='color'
                value={bgColor}
                onChange={(e) => {
                  handleBgColorChange(e);
                  handleQuestionBgChange(e);
                }}
              />
              <span className='color-code'>{bgColor}</span>
              <span className='separator'>|</span>
              <select value={bgOpacity} onChange={handleBgOpacityChange}>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={(i + 1) / 10}>{(i + 1) * 10}%</option>
                ))}
              </select>
            </div>
          </div>

          <div className='color-picker'>
            <p>Section Color</p>
            <div className='color-control'>
              <input type='color' value={sectionColor}
                onChange={(e) => {
                  handleSectionColorChange(e);
                  handleSectionColorUpdate(e);
                }}
              />
              <span className='color-code'>{sectionColor}</span>
              <span className='separator'>|</span>
              <select value={sectionOpacity} onChange={handleSectionOpacityChange}>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={(i + 1) / 10}>{(i + 1) * 10}%</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      <button className='next-btn' onClick={() => setShowFlow(true)}>Next</button>

    </div>
  )
}

export default RightPanel;
