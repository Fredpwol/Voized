import React, { useState } from "react";
import { Modal, Avatar, Typography } from "antd";
import { blue } from "@ant-design/colors";
import {
  AudioMutedOutlined,
  PhoneFilled,
  PauseOutlined,
} from "@ant-design/icons";
import { getNameInitials } from "../../utils";
import { stopCall } from "../../utils/client";
import RecordBtn from "../../assets/images/recording.svg";
import Timer from "../../components/Timer";

const CallScreen = ({ isvisible, caller, collapsed }) => {
  const [start, setStart] = useState(new Date());
  const [isFullscreen, setisFullscreen] = useState(true);
  return isFullscreen ? (
    <Modal
      visible={isvisible}
      footer={null}
      style={{ top: 30 }}
      width="100%"
      onCancel={() => setisFullscreen(false)}
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
              {getNameInitials(caller?.username)}
            </Avatar>
            <Typography.Title
              className="center-text"
              style={{ color: "white" }}
            >
              {caller?.username}
            </Typography.Title>
            <div className="center-item" style={{ fontSize: "20px" }}>
              <AudioMutedOutlined />
            </div>
          </div>
        </div>
        <div className="floating-actions">
          <Timer
            start={start}
            style={{
              fontSize: "30px",
              color: "white",
              marginTop: "8px",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          />
          <div className="center-item floating-action-btn">
            <img src={RecordBtn} />
          </div>
          <div className="center-item floating-action-btn">
            <PauseOutlined />
          </div>
          <div
            className="center-item floating-action-btn"
            style={{ backgroundColor: "red" }}
          >
            <PhoneFilled onClick={() => stopCall(new Date() - start, Date.now() / 1000)} />
          </div>
        </div>
      </div>
    </Modal>
  ) : isvisible ? (
    <div
      onClick={() => setisFullscreen(true)}
      style={{
        height: "80px",
        width: "100%",
        position: "absolute",
        backgroundColor: "lawngreen",
        bottom: 0,
        display: "flex",
        paddingLeft: "80px",
        paddingTop: "18px",
      }}
    >
      <Timer
        start={start}
        style={{
          fontSize: "30px",
          color: "white",
          marginLeft: collapsed ? "80px" : "200px",
          paddingRight: "15px",
        }}
      />
      <div style={{ marginLeft: "20%", color: "#ffffff" }}>
        <h2>Click to return to call</h2>
      </div>
    </div>
  ) : null;
};
//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="https://www.flaticon.com/free-icon/record_1632646" title="Pixelmeetup">Pixelmeetup</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//<div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

export default CallScreen;
