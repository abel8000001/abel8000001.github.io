import React, { useRef } from 'react';
import { Button, Modal as RawModal, TitleBar } from '@react95/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
// Some @react95 exports are typed as forwardRef render functions and don't match
// the JSX component signature. Cast to any locally and use the Content subcomponent
// through a dedicated variable that we render in JSX to avoid `Modal.Content` typing issues.
const Modal: any = RawModal;
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
    
    // Maximize state for windows
    const [isBlogMaximized, setIsBlogMaximized] = React.useState<boolean>(false);
    const [isThoughtsMaximized, setIsThoughtsMaximized] = React.useState<boolean>(false);
    
    // Refs for modal instances to access draggable functionality
    const blogModalRef = useRef<HTMLDivElement>(null);
    const thoughtsModalRef = useRef<HTMLDivElement>(null);

    // Calculate percentage-based positions for responsive window placement
    // Automatically adjusts for Modal's built-in spacing so 0,0 = true top-left edge
    const getResponsivePosition = React.useCallback((offsetXPercent: number, offsetYPercent: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Apply automatic correction for Modal's built-in spacing (fixed pixels, not percentage)
        // The Modal has a fixed pixel offset, so we subtract a fixed amount
        const modalVerticalOffsetPx = 50;
        
        return {
            x: viewportWidth * (offsetXPercent / 100),
            y: (viewportHeight * (offsetYPercent / 100)) - modalVerticalOffsetPx,
        };
    }, []);

    // Get maximized window dimensions (full screen minus taskbar)
    const getMaximizedDimensions = React.useCallback(() => {
        const taskbarHeight = 28; // TaskBar height from React95 (from TaskBar.tsx: h="28px")
        return {
            width: '100vw',
            height: `calc(100vh - ${taskbarHeight}px)`,
        };
    }, []);

    // Maximize/Restore handlers for Blog window
    const handleMaximizeBlogWindow = React.useCallback(() => {
        setIsBlogMaximized(true);
        // Move window to top-left after maximize
        setTimeout(() => {
            if (blogModalRef.current) {
                const position = getResponsivePosition(0, 0);
                blogModalRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
            }
        }, 0);
    }, [getResponsivePosition]);

    const handleRestoreBlogWindow = React.useCallback(() => {
        setIsBlogMaximized(false);
    }, []);

    // Maximize/Restore handlers for Thoughts window
    const handleMaximizeThoughtsWindow = React.useCallback(() => {
        setIsThoughtsMaximized(true);
        // Move window to top-left after maximize
        setTimeout(() => {
            if (thoughtsModalRef.current) {
                const position = getResponsivePosition(0, 0);
                thoughtsModalRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
            }
        }, 0);
    }, [getResponsivePosition]);

    const handleRestoreThoughtsWindow = React.useCallback(() => {
        setIsThoughtsMaximized(false);
    }, []);

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
                    ref={blogModalRef}
                    id="blog-window"
                    width={isBlogMaximized ? getMaximizedDimensions().width : (isMobile ? '95vw' : '90vw')}
                    height={isBlogMaximized ? getMaximizedDimensions().height : (isMobile ? '85vh' : '90vh')}
                    title="Blog"
                    zIndex={1}
                    icon={<img className='windowIcon' src={BlogIcon} alt='Blog' width={16} height={16} />}
                    dragOptions={{
                        defaultPosition: isMobile ? getResponsivePosition(0, 0) : getResponsivePosition(0, 0),
                    }}
                    titleBarOptions={[
                        <Modal.Minimize key="minimize" />,
                        isBlogMaximized 
                            ? <TitleBar.Restore key="restore" onClick={handleRestoreBlogWindow} />
                            : <TitleBar.Maximize key="maximize" onClick={handleMaximizeBlogWindow} />,
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
                    ref={thoughtsModalRef}
                    id="thoughts-window"
                    width={isThoughtsMaximized ? getMaximizedDimensions().width : (isMobile ? '95vw' : '90vw')}
                    height={isThoughtsMaximized ? getMaximizedDimensions().height : (isMobile ? '85vh' : '90vh')}
                    title="Thoughts"
                    zIndex={1}
                    icon={<img className='windowIcon' src={IeIcon} alt='Thoughts' width={16} height={16} />}
                    dragOptions={{
                        defaultPosition: isMobile ? getResponsivePosition(0, 0) : getResponsivePosition(10, 8),
                    }}
                    titleBarOptions={[
                        <Modal.Minimize key="minimize" />,
                        isThoughtsMaximized 
                            ? <TitleBar.Restore key="restore" onClick={handleRestoreThoughtsWindow} />
                            : <TitleBar.Maximize key="maximize" onClick={handleMaximizeThoughtsWindow} />,
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
