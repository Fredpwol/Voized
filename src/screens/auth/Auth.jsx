import React from "react";
import { Layout, Typography } from "antd";

const Auth = ({children}) => {
  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vh" }}>
      <div className="sider">
        <Layout.Sider width="100%" className="siderImage">
          <div style={{ padding: "20px", marginTop: "100px" }}>
            <Typography.Title style={{ color: "white" }}>
              Reach Distance with Your Voice
            </Typography.Title>
          </div>
        </Layout.Sider>
      </div>
      <Layout.Content>
          {children}
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
