import React, { useState, useRef, useEffect } from 'react';
import { Button, Frame, Input } from '@react95/core';
import icons from '../assets/browser-window-icons';
import '../styles/BrowserWindow.css';

type BrowserWindowProps = {
  initialUrl: string;
  title?: string;
  className?: string;
};

const BrowserWindow: React.FC<BrowserWindowProps> = ({ initialUrl, title = 'Browser', className }) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeSrc, setIframeSrc] = useState<string>(initialUrl);
  const [address, setAddress] = useState<string>(initialUrl);
  const [favicon, setFavicon] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleMouseEnter = React.useCallback((buttonName: string) => setHoveredButton(buttonName), []);
  const handleMouseLeave = React.useCallback(() => setHoveredButton(null), []);

  const HOME_URL = initialUrl;

  const refreshIframe = React.useCallback(() => {
    if (iframeSrc === 'about:blank') setIframeSrc(HOME_URL);
    else setIframeKey(k => k + 1);
  }, [iframeSrc, HOME_URL]);

  const stopIframe = React.useCallback(() => setIframeSrc('about:blank'), []);
  const homeIframe = React.useCallback(() => setIframeSrc(HOME_URL), [HOME_URL]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);
  const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let url = address;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    setIframeSrc(url);
  };

  useEffect(() => {
    const extractDomain = (url: string) => {
      const a = document.createElement('a');
      a.href = url;
      return a.hostname;
    };

    const fetchFavicon = async (url: string) => {
      const domain = extractDomain(url);
      const faviconUrl = `https://${domain}/favicon.ico`;
      try {
        const response = await fetch(faviconUrl);
        if (response.ok) setFavicon(faviconUrl);
        else setFavicon(null);
      } catch {
        setFavicon(null);
      }
    };

    fetchFavicon(iframeSrc);
  }, [iframeSrc]);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const iframeLocation = iframe.contentWindow?.location.href;
      if (iframeLocation) setAddress(iframeLocation);
    } catch {
      setAddress(iframe.src);
    }
  };

  type ToolbarItem = {
    key: string;
    label: string;
    action?: () => void;
    disabled?: boolean;
    iconGray: string;
    iconColor: string;
    separatorBefore?: boolean;
  };

  const toolbarItems: ToolbarItem[] = [
    { key: 'back', label: 'Back', disabled: true, iconGray: icons.backGray, iconColor: icons.backColor },
    { key: 'forward', label: 'Forward', disabled: true, iconGray: icons.forwardGray, iconColor: icons.forwardColor },
    { key: 'stop', label: 'Stop', action: stopIframe, iconGray: icons.stopGray, iconColor: icons.stopColor },
    { key: 'refresh', label: 'Refresh', action: refreshIframe, iconGray: icons.refreshGray, iconColor: icons.refreshColor },
    { key: 'home', label: 'Home', action: homeIframe, iconGray: icons.homeGray, iconColor: icons.homeColor },
    { key: 'sp1', label: '', separatorBefore: true, iconGray: '', iconColor: '' },
    { key: 'search', label: 'Search', iconGray: icons.searchGray, iconColor: icons.searchColor },
    { key: 'favorites', label: 'Favorites', iconGray: icons.favoritesGray, iconColor: icons.favoritesColor },
    { key: 'history', label: 'History', iconGray: icons.historyGray, iconColor: icons.historyColor },
    { key: 'sp2', label: '', separatorBefore: true, iconGray: '', iconColor: '' },
    { key: 'mail', label: 'Mail', iconGray: icons.mailGray, iconColor: icons.mailColor },
    { key: 'print', label: 'Print', iconGray: icons.printGray, iconColor: icons.printColor },
  ];

  const ToolbarButton: React.FC<{ item: ToolbarItem }> = ({ item }) => {
    if (item.separatorBefore) return <hr aria-orientation="vertical" />;
    return (
      <Button
        disabled={item.disabled}
        className='browserIcon'
        onMouseEnter={() => handleMouseEnter(item.key)}
        onMouseLeave={handleMouseLeave}
        onClick={item.action}
      >
        <img className='browserIconImage' src={hoveredButton === item.key ? item.iconColor : item.iconGray} alt={item.label} />
        <span>{item.label}</span>
      </Button>
    );
  };

  return (
    // ensure the root fills available space inside ModalContent / parent container
    <div className={`browser-window ${className ?? ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Frame id="toolbar">
        <div className="toolbar-drag-handle" />
        {toolbarItems.map(item => (
          <ToolbarButton key={item.key} item={item} />
        ))}
      </Frame>

      <Frame id="address-bar">
        <div className="toolbar-drag-handle" />
        <label htmlFor="address">Address</label>
        <form id="address-compound-input" className="inset-deep" onSubmit={handleAddressSubmit}>
          {favicon && <img id="address-icon" width={16} height={16} src={favicon} alt="Favicon" />}
          <Input id='address' value={address} onChange={handleAddressChange} autoComplete="off" />
        </form>
      </Frame>

      {/* make this frame flex:1 so the iframe fills remaining space */}
      <Frame bg="white" boxShadow="$in" h="100%" w="100%" style={{ flex: 1, display: 'flex' }}>
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={iframeSrc}
          title={title}
          onLoad={handleIframeLoad}
          style={{ flex: 1, border: 0, width: '100%', height: '100%' }}
        />
      </Frame>
    </div>
  );
};

export default BrowserWindow;