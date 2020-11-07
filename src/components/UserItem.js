import React from "react";
import { Avatar, Button, Typography } from "antd";
import { PhoneOutlined, UserAddOutlined } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";
import { connect } from "react-redux";

const UserItem = ({
  title,
  body,
  status,
  image,
  leftComponent,
  rightComponent,
  _id,
  userData
}) => {
  return (
    <div className="user-item">
      <Avatar
        size="large"
        src={image?.src}
        style={{ backgroundColor: presetPrimaryColors[image.bgColor] || "blue" }}
      >
        {image?.Acronym}
      </Avatar>
      <div className="item-data">
        <div>
          <div>
            <Typography.Text style={{ fontWeight: "bold" }}>
              {title}
            </Typography.Text>
            <Typography.Text type="success" style={{ marginLeft: "10px" }}>
              {status}
            </Typography.Text>
          </div>
          <div>{body}</div>
        </div>
        <div>
          {userData[_id] ?
          (
            <PhoneOutlined
            style={{ color: presetPrimaryColors.blue, fontSize: "25px" }}
          />
          ):
          (
            <Button icon={<UserAddOutlined />}>
              Add
            </Button>
          )
          }
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, null)(UserItem);
