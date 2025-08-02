import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formId: null,
    formData: null,
    pages: [
        {
            pageId: 1,
            pageTitle: 'Page 01',
            questions: []
        },
    ],
    selectedPageId: 1,
    selectedQuestionId: null,
    pageCounter: 1,
    conditionPages: {},
    conditionAnswers: {},
    pageConditions: {},
    lastAnsweredPageId: null,
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormId: (state, action) => {
            state.formId = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        clearForm: (state) => {
            state.formId = null;
            state.formData = null;
        },
        addPage: (state) => {
            state.pageCounter += 1;
            state.pages.push({
                pageId: state.pageCounter,
                pageTitle: `Page ${state.pageCounter.toString().padStart(2, '0')}`,
                questions: [],
            });
        },
        selectPage: (state, action) => {
            state.selectedPageId = action.payload;
            state.selectedQuestionId = null;
        },
        selectQuestion: (state, action) => {
            state.selectedQuestionId = action.payload;
        },
        updateQuestionBgColor: (state, action) => {
            const { pageId, questionId, color } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            const question = page?.questions.find((q) => q.id === questionId);
            if (question) question.bgColor = color;
        },
        addQuestion: (state) => {
            const currentPage = state.pages.find(p => p.pageId === state.selectedPageId);

            if (currentPage) {
                const id = currentPage.questions.length + 1;
                currentPage.questions.push({
                    id,
                    type: 'Multiple Choice',
                    questionText: `Q${id} What is ?`,
                    options: ['Option 1', 'Option 2'],
                });
            }
        },
        addSection: (state, action) => {
            const { pageId, questionId, sectionColor = '#B6B6B6' } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            if (!page) return;

            const selectedIndex = page.questions.findIndex((q) => q.id === questionId);
            if (selectedIndex === -1) return;

            if (page.questions[selectedIndex].sectionId) return;

            // Start from the selected question and move backward to collect un-sectioned questions
            let startIndex = selectedIndex;
            while (startIndex > 0 && !page.questions[startIndex - 1].sectionId) {
                startIndex--;
            }

            // Take all questions from startIndex to selectedIndex (inclusive)
            const questionsForSection = page.questions.slice(startIndex, selectedIndex + 1).filter((q) => !q.sectionId);

            if (questionsForSection.length === 0) return;

            if (!page.sections) {
                page.sections = [];
            }

            //Generate a new unique section ID
            const newSectionId = page.sections.length + 1;

            //Push new section (isolated color)
            page.sections.push({
                sectionId: newSectionId,
                questions: questionsForSection.map((q) => q.id),
                bgColor: sectionColor,
            });

            //Assign sectionId ONLY to the selected questions
            questionsForSection.forEach((q) => {
                q.sectionId = newSectionId;
            });
        },

        updateSectionColor: (state, action) => {
            const { pageId, sectionId, color } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);
            const section = page?.sections?.find(s => s.sectionId === sectionId);
            if (section) section.bgColor = color;
        },
        updateQuestionText: (state, action) => {
            const { questionId, text } = action.payload;
            const page = state.pages.find(p => p.pageId === state.selectedPageId);
            const question = page?.questions.find(q => q.id === questionId);
            if (question) question.questionText = text;
        },
        removeQuestion: (state, action) => {
            const { pageId, questionId } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);

            if (!page) return;

            page.questions = page.questions.filter(q => q.id !== questionId);

            // Renumber and preserve all other fields
            page.questions = page.questions.map((q, index) => {
                const originalText = q.questionText.startsWith('Q')
                    ? q.questionText.split(' ').slice(1).join(' ')
                    : q.questionText;

                return {
                    ...q,
                    id: index + 1,
                    questionText: `Q${index + 1} ${originalText}`,
                };
            });
        },
        updateOption: (state, action) => {
            const { questionId, optionIndex, value } = action.payload;
            const page = state.pages.find(p => p.pageId === state.selectedPageId);
            const question = page?.questions.find(q => q.id === questionId);
            if (question) {
                question.options[optionIndex] = value;
            }
        },
        addOption: (state, action) => {
            const { questionId } = action.payload;
            const page = state.pages.find(p => p.pageId === state.selectedPageId);
            const question = page?.questions.find(q => q.id === questionId);
            if (question) {
                const count = question.options.length + 1;

                let optionText = '';
                switch (question.type) {
                    case 'Dropdown':
                        optionText = `Dropdown Option ${count}`;
                        break;
                    case 'Multiple Choice':
                    case 'Checkbox':
                    default:
                        optionText = `Option ${count}`;
                        break;
                }

                question.options.push(optionText);
            }
        },
        removeOption: (state, action) => {
            const { questionId, index } = action.payload;
            const page = state.pages.find(p => p.pageId === state.selectedPageId);
            const question = page?.questions.find(q => q.id === questionId);
            if (question && question.options.length > 1) {
                question.options.splice(index, 1);
                // Regenerate default option text after removal
                question.options = question.options.map((_, idx) => {
                    switch (question.type) {
                        case 'Dropdown':
                            return `Dropdown Option ${idx + 1}`;
                        case 'Multiple Choice':
                        case 'Checkbox':
                        default:
                            return `Option ${idx + 1}`;
                    }
                });
            }
        },
        updateQuestionType: (state, action) => {
            const { pageId, questionId, newType } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            const question = page.questions.find((q) => q.id === questionId);
            question.type = newType;

            // Reset question text when changing to Rating
            if (newType === 'Rating') {
                question.questionText = `Q${question.id} Rate us by choosing stars?`;
            }

            //Reset options based on type
            if (newType === 'Multiple Choice' || newType === 'Checkbox') {
                question.options = ['Option 1', 'Option 2']
            }
            else if (newType === 'Dropdown') {
                question.options = ['Drop Down Option 1', 'Drop Down Option 2'];
            }
            else if (newType === 'File Upload') {
                question.options = [];
                question.maxFiles = 5;
                question.maxFileSize = '5mb';
                question.fileTypes = ['image', 'pdf', 'ppt', 'document', 'video', 'zip', 'audio', 'spreadsheet'];
            }
            else if (newType === 'Date') {
                question.options = [];
                question.dateValue = '';
            }
            else if (newType === 'Linear Scale') {
                question.linearScale = {
                    min: 0,
                    max: 10,
                    selected: 5
                };
            }
            else if (newType === 'Rating') {
                question.rating = {
                    selected: 0,
                    count: 5
                };
                question.options = [];
            }
            else {
                question.options = []; // Clear for short/long answer, rating, etc.
            }
        },
        updateAnswerText: (state, action) => {
            const { pageId, questionId, text } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);
            const question = page.questions.find(q => q.id === questionId);
            question.answerText = text;
            state.lastAnsweredPageId = pageId;
        },
        updateFileUploadSettings: (state, action) => {
            const { pageId, questionId, field, value } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            const question = page.questions.find((q) => q.id === questionId);
            if (question) {
                question[field] = value;
            }
        },
        updateDateAnswer: (state, action) => {
            const { pageId, questionId, value } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);
            const question = page?.questions.find(q => q.id === questionId);
            if (question) {
                question.dateValue = value;
                state.lastAnsweredPageId = pageId;
            }
        },
        updateLinearScale: (state, action) => {
            const { pageId, questionId, field, value } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);
            const question = page?.questions.find(q => q.id === questionId);

            if (question && question.type === 'Linear Scale') {
                if (!question.linearScale) {
                    question.linearScale = { min: 0, max: 10, selected: 5 };
                }
                question.linearScale[field] = value;
            }
        },
        updateRating: (state, action) => {
            const { pageId, questionId, field, value } = action.payload;
            const page = state.pages.find(p => p.pageId === pageId);
            const question = page?.questions.find(q => q.id === questionId);

            if (question && question.type === 'Rating') {
                if (!question.rating) {
                    question.rating = { selected: 0, count: 5 };
                }
                question.rating[field] = value;
            }
        },
        addImageQuestion: (state, action) => {
            const page = state.pages.find((p) => p.pageId === state.selectedPageId);
            if (page) {
                const id = page.questions.length + 1;
                page.questions.push({
                    id,
                    type: 'Image',
                    questionText: `Q${id} Upload an Image Question`,
                    imageUrl: '',
                    shortText: '',
                    options: [],
                });
            }
        },
        updateShortAnswer: (state, action) => {
            const { pageId, questionId, answer } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            if (page) {
                const question = page.questions.find((q) => q.id === questionId);
                if (question) question.answerText = answer;
            }
        },
        updateImageQuestion: (state, action) => {
            const { pageId, questionId, imageUrl } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            if (page) {
                const question = page.questions.find((q) => q.id === questionId);
                if (question) question.imageUrl = imageUrl;
            }
        },
        updateVideoQuestion: (state, action) => {
            const { pageId, questionId, videoUrl } = action.payload;
            const page = state.pages.find((p) => p.pageId === pageId);
            if (page) {
                const question = page.questions.find((q) => q.id === questionId);
                if (question) {
                    question.videoUrl = videoUrl;
                }
            }
        },
        addVideoQuestion: (state, action) => {
            const page = state.pages.find((p) => p.pageId === state.selectedPageId);
            if (page) {
                const id = page.questions.length + 1;
                page.questions.push({
                    id,
                    type: 'Video',
                    questionText: `Q${id} Upload a Video Question`,
                    videoUrl: '',
                    shortText: '',
                    options: [],
                });
            }
        },
        setShowCondition: (state, action) => {
            const pageId = action.payload;
            state.conditionPages[pageId] = true;
        },

        setConditionAnswer: (state, action) => {
            const { pageId, questionId, answer, isMulti, checked, type } = action.payload;

            if (!state.conditionAnswers[questionId]) {
                state.conditionAnswers[questionId] = [];
            }

            if (isMulti) {
                if (checked) {
                    if (!state.conditionAnswers[questionId].includes(answer)) {
                        state.conditionAnswers[questionId].push(answer);
                    }
                } else {
                    state.conditionAnswers[questionId] = state.conditionAnswers[questionId].filter(a => a !== answer);
                }
            } else {
                state.conditionAnswers[questionId] = [answer];
            }
            state.lastAnsweredPageId = pageId;
        },
        setPageCondition: (state, action) => {
            const { selectedPageId, truePage, falsePage } = action.payload;

            if (!state.pageConditions) {
                state.pageConditions = {};
            }

            state.pageConditions[selectedPageId] = { truePage, falsePage };
        },
        addTextQuestion: (state) => {
            const page = state.pages.find((p) => p.pageId === state.selectedPageId);
            if (page) {
                const id = page.questions.length + 1;
                page.questions.push({
                    id,
                    type: 'Text',
                    questionText: `Q${id} Enter your text below:`,
                    answerText: '',
                });
            }
        },
        setLastAnsweredPage: (state, action) => {
            state.lastAnsweredPageId = action.payload; // Store the page ID
        },

    },
});

export const { addPage,
    selectPage,
    selectQuestion,
    updateQuestionBgColor,
    addQuestion,
    addSection,
    updateSectionColor,
    updateQuestionText,
    removeQuestion,
    updateOption,
    addOption,
    removeOption,
    updateQuestionType,
    updateAnswerText,
    updateFileUploadSettings,
    updateDateAnswer,
    updateLinearScale,
    updateRating,
    updateShortAnswer,
    addImageQuestion,
    updateImageQuestion,
    addVideoQuestion,
    updateVideoQuestion,
    setShowCondition,
    setConditionAnswer,
    setPageCondition,
    addTextQuestion,
    setFormId,
    setLastAnsweredPage,
    setFormData,
    clearForm
} = formSlice.actions;
export default formSlice.reducer;