import React from 'react';
import { Button, Modal as RawModal, TitleBar } from '@react95/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
// Some @react95 exports are typed as forwardRef render functions and don't match
// the JSX component signature. Cast to any locally and use the Content subcomponent
// through a dedicated variable that we render in JSX to avoid `Modal.Content` typing issues.
const Modal: React.ComponentType<any> = RawModal as unknown as React.ComponentType<any>;
const ModalContent: React.ComponentType<any> = (RawModal as any).Content;
import BlogIcon from '../assets/blog-icon.png';
import IeIcon from '../assets/thoughts-icon.png';
import '../styles/Desktop.css';
import BlogWindow from './BlogWindow';
import ThoughtsWindow from './ThoughtsWindow';
import FileMenu from './MenuBar/FileMenu.tsx';
import EditMenu from './MenuBar/EditMenu.tsx';
import ViewMenu from './MenuBar/ViewMenu.tsx';
import FavoritesMenu from './MenuBar/FavoritesMenu.tsx';
import ToolsMenu from './MenuBar/ToolsMenu.tsx';
import HelpMenu from './MenuBar/HelpMenu.tsx';

const Desktop: React.FC = () => {
    const [showBlogWindow, setShowBlogWindow] = React.useState<boolean>(false);
    const [showThoughtsWindow, setShowThoughtsWindow] = React.useState<boolean>(false);

    const handleCloseBlogWindow = React.useCallback(() => setShowBlogWindow(false), []);
    const handleOpenBlogWindow = React.useCallback(() => setShowBlogWindow(true), []);
    const handleCloseThoughtsWindow = React.useCallback(() => setShowThoughtsWindow(false), []);
    const handleOpenThoughtsWindow = React.useCallback(() => setShowThoughtsWindow(true), []);

    // For the radio buttons in the Blog window (kept for compatibility)
    const [selectedOption] = React.useState<string>('medium');

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <>
            <div className='desktopIcon' id='blog-icon'>
                <Button onClick={handleOpenBlogWindow}>
                    <img src={BlogIcon} alt='Blog' />
                    <span>Blog</span>
                </Button>
            </div>
            <div className='desktopIcon' id='thoughts-icon'>
                <Button onClick={handleOpenThoughtsWindow}>
                    <img src={IeIcon} alt='Internet Explorer' />
                    <span>Thoughts</span>
                </Button>
            </div>

            {showBlogWindow && (
                <Modal
                    width={isMobile ? '95vw' : '90vw'}
                    height={isMobile ? '85vh' : '90vh'}
                    title="Blog"
                    zIndex={1}
                    icon={<img className='windowIcon' src={BlogIcon} alt='Blog' width={16} height={16} />}
                    dragOptions={{
                        defaultPosition: isMobile ? { x: 10, y: 10 } : { x: 60, y: -30 },
                    }}
                    titleBarOptions={[
                        <TitleBar.Minimize key="minimize" />,
                        <TitleBar.Restore key="restore" />,
                        <TitleBar.Close key="close" onClick={handleCloseBlogWindow} />,
                    ]}
                    menu={[
                        { name: 'File', list: <FileMenu handleCloseBlogWindow={handleCloseBlogWindow} /> },
                        { name: 'Edit', list: <EditMenu /> },
                        { name: 'View', list: <ViewMenu selectedOption={selectedOption} /> },
                        { name: 'Favorites', list: <FavoritesMenu /> },
                        { name: 'Tools', list: <ToolsMenu /> },
                        { name: 'Help', list: <HelpMenu /> },
                    ]}
                >
                    {/* ensure ModalContent fills modal; remove default padding that could shrink inner area */}
                    <ModalContent style={{ height: '100%', padding: 0 }}>
                        <BlogWindow />
                    </ModalContent>
                </Modal>
            )}

            {showThoughtsWindow && (
                <Modal
                    width={isMobile ? '95vw' : '90vw'}
                    height={isMobile ? '85vh' : '90vh'}
                    title="Thoughts"
                    zIndex={1}
                    icon={<img className='windowIcon' src={IeIcon} alt='Thoughts' width={16} height={16} />}
                    dragOptions={{
                        defaultPosition: isMobile ? { x: 10, y: 20 } : { x: 45, y: 10 },
                    }}
                    titleBarOptions={[
                        <TitleBar.Minimize key="minimize" />,
                        <TitleBar.Restore key="restore" />,
                        <TitleBar.Close key="close" onClick={handleCloseThoughtsWindow} />,
                    ]}
                    menu={[
                        { name: 'File', list: <FileMenu handleCloseBlogWindow={handleCloseThoughtsWindow} /> },
                        { name: 'Edit', list: <EditMenu /> },
                        { name: 'View', list: <ViewMenu selectedOption={selectedOption} /> },
                        { name: 'Favorites', list: <FavoritesMenu /> },
                        { name: 'Tools', list: <ToolsMenu /> },
                        { name: 'Help', list: <HelpMenu /> },
                    ]}
                >
                    <ModalContent style={{ height: '100%', padding: 0 }}>
                        <ThoughtsWindow />
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default Desktop;
