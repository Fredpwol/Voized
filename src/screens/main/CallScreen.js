import React from "react";
import { Modal, Avatar, Typography } from "antd";
import { blue } from "@ant-design/colors";
import { AudioMutedOutlined, PhoneFilled, PauseOutlined } from "@ant-design/icons";
import { getNameInitials } from "../../utils";
import { stopCall } from "../../utils/client";

const CallScreen = ({ isvisible, caller }) => {
  return (
    <Modal
      visible={isvisible}
      footer={null}
      style={{ top: 30 }}
      width="100%"
      bodyStyle={{ backgroundColor: "#002766", color: "white" }}
    >
      <div className="call-body">
        <div className="center-item wrap-list">
          <div className="call-card">
            <Avatar
              size={{ xs: 130, sm: 140, md: 150, lg: 160, xl: 170, xxl: 180 }}
              src={caller?.profile_pic}
              style={{
                backgroundColor: caller?.bg_color,
                fontSize: "100px",
                margin: "10px",
              }}
            >
              {getNameInitials(caller?.username) || "D"}
            </Avatar>
            <Typography.Title
              className="center-text"
              style={{ color: "white" }}
            >
              {caller?.username || "Daniel"}
            </Typography.Title>
            <div className="center-item" style={{ fontSize: "20px" }}>
              <AudioMutedOutlined />
            </div>
          </div>
        </div>
        <div className="floating-actions">
        <div className="center-item floating-action-btn">
            <PauseOutlined />
          </div>
        <div className="center-item floating-action-btn" style={{ backgroundColor: "red" }}>
            <PhoneFilled onClick={() => stopCall()} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="https://www.flaticon.com/free-icon/record_1632646" title="Pixelmeetup">Pixelmeetup</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//<div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

export default CallScreen;
