import React from 'react';
import { Typography, Layout, Input } from "antd"


import UserItem from '../../components/UserItem';
import Divider from '../../components/Divider';


const Contact = () => {
    return(
        <div className="content-body">
            <Layout.Header className="content-head">
                <h1 className="title-text" >
                    Contacts
                </h1>
                <Input.Search placeholder="Type in to Search..." enterButton style={{width:"40%"}} />
            </Layout.Header>
            <Divider />
            <div style={{paddingTop:"10px"}}>
                <UserItem />
            </div>
        </div>
    )
};



export default Contact;