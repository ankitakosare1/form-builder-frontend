import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPage, addPage } from '../../redux/Slices/formSlice';
import './SidebarStyle.css';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import ProfileLink from '../ProfileLink/ProfileLink';

const Sidebar = () => {
    const { pages, selectedPageId, pageConditions } = useSelector(state => state.form);
    const dispatch = useDispatch();

    // Extract markers (true & false separately)
    const getConditionMarkers = (pageId) => {
        const condition = pageConditions?.[pageId];
        if (condition) {
            return {
                isConditionPage: true,
                truePage: condition.truePage,
                falsePage: condition.falsePage,
            };
        }

        const isReferenced = Object.values(pageConditions || {}).some(
            (cond) => Number(cond?.truePage) === Number(pageId) || Number(cond?.falsePage) === Number(pageId)
        );

        return { isReferenced, truePage: null, falsePage: null };
    };

    return (
        <div className='sidebar'>
            <div className='page-sidebar'>
                {/* Top Header */}
                <SidebarHeader />

                {/* Sidebar Pages */}
                <div className='page-list'>
                    {pages.map((page) => {
                        const { isConditionPage, isReferenced, truePage, falsePage } = getConditionMarkers(page.pageId);

                        return (
                            <div
                                key={page.pageId}
                                className={`page-item ${selectedPageId === page.pageId ? 'active' : ''}`}
                                onClick={() => dispatch(selectPage(page.pageId))}
                            >
                                <span className="page-title">{page.pageTitle}</span>

                                {/* Condition markers */}
                                <div className="condition-markers">
                                    {isConditionPage && (
                                        <div className="condition-colon">
                                            {/* True Page Dot */}
                                            <span
                                                className="condition-dot"
                                                title={`Goes to TRUE page: ${pages.find(p => Number(p.pageId) === Number(truePage))?.pageTitle || ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (truePage) dispatch(selectPage(Number(truePage)));
                                                }}
                                            ></span>

                                            {/* False Page Dot */}
                                            <span
                                                className="condition-dot"
                                                title={`Goes to FALSE page: ${pages.find(p => Number(p.pageId) === Number(falsePage))?.pageTitle || ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (falsePage) dispatch(selectPage(Number(falsePage)));
                                                }}
                                            ></span>
                                        </div>
                                    )}

                                    {/* Referenced marker (if referenced elsewhere) */}
                                    {!isConditionPage && isReferenced && (
                                        <span className="condition-marker">•</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Page Button */}
                <button className='add-page' onClick={() => dispatch(addPage())}>+ Add new Page</button>
            </div>
            <ProfileLink />
        </div>
    );
};

export default Sidebar;






