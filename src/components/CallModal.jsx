import React from "react";
import { Avatar, Modal, Typography } from "antd";
import { PhoneFilled } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";
import { getNameInitials } from "../utils";
import { createAnswer, rejectOffer, stopCall } from "../utils/client";

const CallModal = ({ isvisible, caller, offer, userId }) => {
  console.log(offer, "offer");
  return (
    <Modal
      centered
      visible={isvisible}
      closable={false}
      footer={null}
      bodyStyle={{
        backgroundImage: `linear-gradient(rgba(64, 169, 255, 0.5), rgba(9, 48, 102)), url(${caller?.profile_pic})`,
        backgroundSize: "cover",
        backgroundColor: presetPrimaryColors[caller?.bg_color],
      }}
    >
      <div className="modal-header">
        <div className="center-item">
          <Avatar
            size={{ xs: 130, sm: 140, md: 150, lg: 160, xl: 170, xxl: 180 }}
            src={caller?.profile_pic}
            style={{ backgroundColor: caller?.bg_color, fontSize:"100px" }}
          >
            {getNameInitials(caller?.username)}
          </Avatar>
        </div>
        <Typography.Title className="center-text">
          {caller?.username}
        </Typography.Title>
        <div className="inline-buttons">
          {offer?.from !== userId ? (
            <div className="icon-button" style={{ backgroundColor: "#37de28" }}>
              <PhoneFilled onClick={() => createAnswer()} />
            </div>
          ) : null}
          <div className="icon-button" style={{ backgroundColor: "red" }}>
            <PhoneFilled rotate={220} onClick={() => {
                rejectOffer()
            }} />
          </div>
        </div>
        <audio id="call-audio" />
      </div>
    </Modal>
  );
};

export default CallModal;
