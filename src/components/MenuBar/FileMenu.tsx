import React from 'react';

type Props = {
  handleCloseBlogWindow?: () => void;
};

const FileMenu: React.FC<Props> = ({ handleCloseBlogWindow }) => {
  return (
    <div className="menu-list">
      <button onClick={() => handleCloseBlogWindow && handleCloseBlogWindow()}>Close Window</button>
    </div>
  );
};

export default FileMenu;
