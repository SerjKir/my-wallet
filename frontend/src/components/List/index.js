import React from 'react';

const Index = ({children}) => {
  return (
    <div>
      {children}
      <hr style={{marginTop: '10px'}}/>
    </div>
  );
};

export default Index;