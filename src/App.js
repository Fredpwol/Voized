import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Modal, Typography, message } from "antd";
import {
  BellOutlined,
  FileOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";
import { Switch, Route, Link, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import ImageUploader from "react-images-upload";
import socket from "socket.io-client";


import Feed from "./screens/main/Feed";
import Contact from "./screens/main/Contact";
import Login from "./screens/auth/Login";
import SignUp from "./screens/auth/SignUp";
import Auth from "./screens/auth/Auth";
import UserScreen from "./screens/main/UserScreen";
import { getNameInitials } from "./utils";
import { uploadImage, toggleNewRegister, getContacts } from "./actions";
import AvatarUpload from "./components/AvatarUpload";
import { io } from "./utils/client";
import CallModal from "./components/CallModal";
import CallScreen from "./screens/main/CallScreen";

const { Header, Content, Footer, Sider } = Layout;

const App = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(1);
  const location = useLocation();

  useEffect(() => {
    props.getContacts(props.user.id, props.user.token)
  },[props.user.id])

  useEffect(() => {
    io.emit("set:user", {id : props.user.id})
    return () => {
      io.disconnect();
    };
  }, []);

  const getMenuData = (username) => {
    return [
      {
        icon: (
          <Avatar
            size="small"
            src={props.user.profileImage}
            style={{
              marginRight: "25px",
              backgroundColor: presetPrimaryColors[props.user.userBgColor],
            }}
          >
            {getNameInitials(username)}
          </Avatar>
        ),
        title: "    " + username,
        link: "/user",
      },
      {
        icon: <BellOutlined />,
        title: "Activites",
        link: "/",
      },
      {
        icon: <UserOutlined />,
        title: "Contacts",
        link: "/contact",
      },
      {
        icon: <TeamOutlined />,
        title: "Rooms",
      },
    ];
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return !props.user.isAuthenticated ? (
    <Auth>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={SignUp} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Auth>
  ) : (
    <Layout style={{ minHeight: "95vh" }}>
      <Modal
        visible={props.appData.newRegister}
        onClose={props.toggleNewRegister}
        destroyOnClose
        onOk={props.toggleNewRegister}
        onCancel={props.toggleNewRegister}
      >
        <Typography.Title level={3} className="center-text">
          Upload Profile Image
        </Typography.Title>
        <div style={{ marginLeft: "40%" }}>
          <AvatarUpload />
        </div>
      </Modal>
      <CallScreen isvisible={props.callData.onCall} collapsed={collapsed} caller={props.callData.recipient[0]} />
      <CallModal isvisible={props.callData.ringing} caller={props.callData.recipient[0]} offer={props.callData.offer} userId={props.user.id} />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={`${selected}`}>
          {props.user.isAuthenticated
            ? getMenuData(props.user.username).map((data, index) => (
                <Menu.Item icon={data.icon} key={`${index}`}>
                  <Link to={data.link}>{data.title}</Link>
                </Menu.Item>
              ))
            : null}
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{marginLeft:(collapsed ? "80px" :"200px")}} >
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content className="content-body">
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/contact" component={Contact} />
            <Route path="/user" component={UserScreen} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
  appData: state.appData,
  callData: state.callData
});

export default connect(mapStateToProps, { uploadImage, toggleNewRegister, getContacts })(
  App
);
