import React from 'react';

// Phosphor-style FilePdf icon
const FilePdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256" {...props}>
    <path d="M216,88H152V24H88a16,16,0,0,0-16,16V80H40a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V104A16,16,0,0,0,216,88ZM88,40h48v48H88Zm128,144H40V96H72v56a8,8,0,0,0,16,0V96h80v40a8,8,0,0,0,16,0V96h24v88ZM104,136H72a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16Zm40-32h32a8,8,0,0,1,0,16H144a8,8,0,0,1,0-16Zm40,64H152a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16Z"></path>
  </svg>
);

export default FilePdfIcon;
