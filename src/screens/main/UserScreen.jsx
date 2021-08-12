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
      </div>
              <div style={{ border: "1px" }}>
          <center>
          <Avatar
            src={profileImage}
            size={{ xs: 24, sm: 40, md: 90, lg: 130, xl: 160, xxl: 200 }}
            style={{
              fontSize: "15vh",
              bottom:"50px",
              backgroundColor: presetPrimaryColors[userBgColor],
            }}
          >
            {getNameInitials(username)}
          </Avatar>

          <CameraOutlined
          onClick={toggleNewRegister}
          style={{
            position: "relative",
            fontSize: "25px",
            marginLeft: "7%",
            zIndex: 10,
          }}
        />
          </center>
          
        </div>
        <Typography.Title
          style={{ color: "#ffffff", marginLeft: "20%", marginBottom: "5px" }}
        >
          {username}
        </Typography.Title>
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
