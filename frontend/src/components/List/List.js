import React from 'react';

const List = ({children}) => {
  return (
    <div>
      {children}
      <hr style={{marginTop: '10px'}}/>
    </div>
  );
};

export default List;