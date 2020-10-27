import React from "react";
import { Layout, Menu } from "antd";
import { BellOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";



import Feed from "./screens/main/Feed";
import Contact from "./screens/main/Contact";
import Login from "./screens/auth/Login";
import SignUp from "./screens/auth/SignUp";
import Auth from "./screens/auth/Auth";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  componentDidMount() {
    console.log("props", this.props.user);
  }

  render() {
    const { collapsed } = this.state;
    return !this.props.user.isAuthenticated ? (
      <Auth>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={SignUp} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Auth>
    ) : (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          style={{ overflow: "auto", height: "100vh", marginTop:"0px" }}
        >
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<BellOutlined />}>
              <Link to="/">Activites</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/contact">Contact</Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
          <Content style={{ margin: "0 16px" }}>
            <Switch>
              <Route exact path="/" component={Feed} />
              <Route path="/contact" component={Contact} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps, null)(App);
