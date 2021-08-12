import React from 'react';
import { Typography } from "antd";


const NotifyImage = ({image, alt, title}) => {
    return(
        <div className="center-item">
        <div>
        <img src={image} height="500px" width="500px" alt={alt} style={{borderRadius:"40%"}} />
        <h2 className="center-text" style={{color: "#1890FF"}}>
          {title}
        </h2>
        </div>
      </div>
    )
};



export default NotifyImage;