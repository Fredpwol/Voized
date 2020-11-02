import React from "react";
import { Avatar, Typography } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";

const UserItem = () => {
  return (
    <div className="user-item">
      <Avatar size="large">F</Avatar>
      <div className="item-data">
        <div>
          <div>
            <Typography.Text style={{ fontWeight: "bold" }}>
              Freddthink
            </Typography.Text>
            <Typography.Text type="success" style={{ marginLeft: "10px" }}>
              Online
            </Typography.Text>
          </div>
          <div>Hello</div>
        </div>
        <div>
          <PhoneOutlined
            style={{ color: presetPrimaryColors.blue, fontSize: "25px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserItem;
