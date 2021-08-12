import React from 'react';
import { Layout } from 'antd';


const Header = ({ leftComponent, title}) => {
    return(
        <Layout.Header className="content-head">
        <h1 className="title-text">{title}</h1>
        {leftComponent}
      </Layout.Header>
    )
};



export default Header;