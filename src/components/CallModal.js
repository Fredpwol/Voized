import React from "react";
import { Avatar, Modal, Typography } from "antd";
import { PhoneFilled } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";

const img =
  "http://localhost:5000/static/profile_pic/a2f83e7c1f0465c161864661db8711d1a775cfcc3394961549947f0884dc0c14.jpg";
const CallModal = ({ isvisible, caller }) => {
  return (
    <Modal
      centered
      visible={isvisible}
      closable={false}
      footer={null}
      bodyStyle={{
        backgroundImage: `linear-gradient(rgba(64, 169, 255, 0.5), rgba(9, 48, 102)), url(${img})`,
        backgroundSize: "cover",
        backgroundColor: presetPrimaryColors["orange"],
      }}
    >
      <div className="modal-header">
        <div className="center-item">
          <Avatar
            size={{ xs: 130, sm: 140, md: 150, lg: 160, xl: 170, xxl: 180 }}
            src={img}
          >
            D
          </Avatar>
        </div>
        <Typography.Title className="center-text">Daniel</Typography.Title>
        <div className="inline-buttons">
          <div className="icon-button" style={{ backgroundColor: "red" }}>
            <PhoneFilled rotate={220} />
          </div>
          <div className="icon-button" style={{ backgroundColor: "#37de28" }}>
            <PhoneFilled />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CallModal;
