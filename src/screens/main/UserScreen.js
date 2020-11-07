import React from "react";
import { Avatar, Typography, Button } from "antd";
import { LogoutOutlined, CameraOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { blue, presetPrimaryColors } from "@ant-design/colors";

import { logoutUser, toggleNewRegister } from "../../actions";

import { getNameInitials } from "../../utils";

const UserScreen = ({
  user: { userBgColor, username, profileImage },
  logoutUser,
  toggleNewRegister,
}) => {
  return (
    <div>
      <div className="profile-bg">
        <div style={{ border: "1px" }}>
          <Avatar
            src={profileImage}
            size={{ xs: 24, sm: 40, md: 90, lg: 130, xl: 160, xxl: 200 }}
            style={{
              bottom: "-100px",
              marginLeft: "15px",
              fontSize: "15vh",
              backgroundColor: presetPrimaryColors[userBgColor],
            }}
          >
            {getNameInitials(username)}
          </Avatar>
        </div>
        <CameraOutlined
          onClick={toggleNewRegister}
          style={{
            position: "relative",
            fontSize: "25px",
            marginLeft: "7%",
            zIndex: 10,
          }}
        />
        <Typography.Title
          style={{ color: "#ffffff", marginLeft: "20%", marginBottom: "5px" }}
        >
          {username}
        </Typography.Title>
      </div>
      <div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          style={{ right: 10, position: "absolute" }}
          onClick={() => logoutUser()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps, { logoutUser, toggleNewRegister })(
  UserScreen
);
