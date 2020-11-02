import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar } from "antd";
import { BellOutlined, FileOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";
import { Switch, Route, Link, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import Feed from "./screens/main/Feed";
import Contact from "./screens/main/Contact";
import Login from "./screens/auth/Login";
import SignUp from "./screens/auth/SignUp";
import Auth from "./screens/auth/Auth";
import UserScreen from "./screens/main/UserScreen";
import { getNameInitials } from "./utils";

const { Header, Content, Footer, Sider } = Layout;



const App = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(1);
  const location = useLocation();


  const getMenuData = (username) => {
    return [
      {
        icon:(<Avatar
          size="small"
          style={{
            marginRight: "25px",
            backgroundColor: presetPrimaryColors[props.user.userBgColor],
          }}
        >
          {getNameInitials(username)}
        </Avatar>),
        title: "    " + username,
        link:"/user"
      },
      {
        icon:<BellOutlined />,
        title:"Activites",
        link:"/"
      },
      {
        icon:<UserOutlined />,
        title: "Contacts",
        link:"/contact"
      },
      {
        icon: <TeamOutlined /> ,
        title: "Rooms"
      }
    ]
  }

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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{ overflow: "auto", marginTop: "0px" }}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={`${selected}`}>
          {props.user.isAuthenticated ? getMenuData(props.user.username).map((data, index) => (
            <Menu.Item icon={data.icon} key={`${index}`}>
              <Link to={data.link}>{data.title}</Link>
            </Menu.Item>
          )): null
          }
          
        </Menu>
      </Sider>
      <Layout className="site-layout">
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
});

export default connect(mapStateToProps, null)(App);
