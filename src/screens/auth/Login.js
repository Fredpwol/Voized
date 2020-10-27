import React from "react";
import { Layout, Image, Typography, Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
//<a href='https://www.freepik.com/vectors/background'>Background vector created by freepik - www.freepik.com</a>
//<a href='https://www.freepik.com/vectors/school'>School vector created by pch.vector - www.freepik.com</a>
//<a href='https://www.freepik.com/vectors/background'>Background vector created by Harryarts - www.freepik.com</a>
//<a href='https://www.freepik.com/vectors/background'>Background vector created by freepik - www.freepik.com</a>
//<a href='https://www.freepik.com/vectors/people'>People vector created by pch.vector - www.freepik.com</a>
//<a href='https://www.freepik.com/vectors/school'>School vector created by pch.vector - www.freepik.com</a>
//<span>Photo by <a href="https://unsplash.com/@dexezekiel?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Dex Ezekiel</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
const Login = () => {
  return (
    <div
      style={{
        margin: "100px",
        padding: "50px",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      <Typography.Title>Login</Typography.Title>
      <Form
        initialValues={{ remember: true }}
        className="login-form"
        name="normal_login"
        onFinish={(values) => console.log("values", values)}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username" }]}
        >
          <Input
            placeholder="username or email"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input a password" }]}
        >
          <Input.Password
            placeholder="password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Submit
          </Button>
          <p style={{ marginTop: "10px" }}>
            New Here? <Link to="/register">Register</Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
