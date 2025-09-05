import React from 'react';

const ViewMenu: React.FC<{ selectedOption?: string }> = ({ selectedOption }) => {
  return (
    <div className="menu-list">
      <div>Display: {selectedOption}</div>
    </div>
  );
};

export default ViewMenu;
