import React from "react";
import { Layout, Image, Typography, Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { $ } from "custom-electron-titlebar/lib/common/dom";

const SignUp = () => {
  return (
    <div
      style={{
        margin: "100px",
        padding: "50px",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      <Typography.Title>Register</Typography.Title>
      <Form
        initialValues={{ remember: true }}
        className="login-form"
        name="normal_login"
        onFinish={(values) => console.log("values", values)}
      >
          <Form.Item name="email" rules={[{required:true, message:"Email is a required field"}, {type:"email", message:"Please enter a valid email address"}]}>
            <Input type="email" placeholder="Email Address" prefix={<MailOutlined />} />
          </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username" }]}
        >
          <Input
            placeholder="username"
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
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="confirm password"
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
            Already have an account? <Link to="/">Login</Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
