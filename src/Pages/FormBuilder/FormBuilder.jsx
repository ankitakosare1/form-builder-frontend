import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPage, selectPage } from '../../redux/Slices/formSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Sidebar from '../../Components/Sidebar/Sidebar'
import PageTitle from '../../Components/PageTitle/PageTitle'
import PageContent from '../../Components/PageContent/PageContent'
import RightPanel from '../../Components/RightPanel/RightPanel'

import FlowChart from '../../Components/FlowChart/FlowChart'
import FormPreview from '../../Components/FormPreview/FormPreview'

import './FormBuilderStyle.css'
import { saveDraft } from '../../api/form'

const FormBuilder = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { formId, formName, isDirectForm } = location.state || {};

    const [title, setTitle] = useState(formName || "Untitled");


    const pageConditions = useSelector((state) => state.form.pageConditions);
    const pages = useSelector((state) => state.form.pages);
    const selectedPageId = useSelector((state) => state.form.selectedPageId);
    const selectedPage = pages.find((p) => p.pageId === selectedPageId);
    const conditionAnswers = useSelector((state) => state.form.conditionAnswers);


    const [showFlow, setShowFlow] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddPage = () => {
        dispatch(addPage());
    };

    const handleSelectPage = (pageId) => {
        dispatch(selectPage(pageId));
    }

    const handleSaveDraft = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const { truePage, falsePage } = pageConditions[selectedPageId] || {};
            if (!token) {
                toast.error("You must be logged in to save the form");
                return;
            }

            const questions = pages.flatMap((page) =>
                (page.questions || []).map((q) => {
                    let answer = "";

                    switch (q.type) {
                        case "Text":
                        case "Short Answer":
                            answer = q.answerText || "";
                            break;
                        case "Date":
                            answer = q.dateValue || "";
                            break;
                        case "Linear Scale":
                            answer = q.linearScale?.selected || "";
                            break;
                        case "Rating":
                            answer = q.rating?.selected || "";
                            break;
                        case "Multiple Choice":
                        case "Dropdown":
                            answer = conditionAnswers[q.id]?.[0] || "";
                            break;
                        case "Checkbox":
                            answer = conditionAnswers[q.id] || [];
                            break;
                        case "File Upload":
                            answer = q.files || [];
                            break;
                        default:
                            answer = q.answerText || "";
                            break;
                    }

                    return {
                        questionText: q.questionText,
                        type: q.type,
                        options: q.options || [],
                        answer,
                    };
                })
            );

            const formData = {
                formId,
                name: formName || "Untitled Form",
                pages,
                questions,
                truePage,
                falsePage,
                pageConditions,
                status: "draft"
            };

            console.log("Saving Draft Payload:", formData);
            const res = await saveDraft(formId, formData, token);

            if (res.success) {
                toast.success("Form saved as draft!");
            }
        } catch (err) {
            console.error("Error saving draft:", err);
            toast.error("Failed to save draft");
        }
        finally {
            setLoading(false); 
        }
    };

    if (previewMode) {
        return <FormPreview onBack={() => setPreviewMode(false)} />;
    }

    return (
        <div className='form-builder'>
            <Sidebar pages={pages} selectedPageId={selectedPageId} onSelectPage={handleSelectPage} onAddPage={handleAddPage} />

            <div className='main-area-wrapper'>
                <div className='top-bar'>
                    <PageTitle title={selectedPage?.pageTitle || 'Title'} />
                    <div className='actions'>
                        <button className='btn1' onClick={() => setPreviewMode(true)}>Preview</button>
                        <button className='btn2' onClick={handleSaveDraft} disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Save"}
                        </button>
                    </div>
                </div>

                <div className='top-bar-divider'></div>

                <div className='main-content-wrapper'>
                    <div className='main-content-row'>
                        <div className='page-content-wrapper'>
                            <PageContent />
                        </div>

                        <RightPanel setShowFlow={setShowFlow} />
                    </div>
                    {showFlow && <FlowChart onClose={() => setShowFlow(false)} />}
                </div>

            </div>

        </div>
    );
};

export default FormBuilder;
