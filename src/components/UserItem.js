import React from "react";
import { Avatar, Button, message, Typography } from "antd";
import { PhoneOutlined, UserAddOutlined } from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";
import { connect } from "react-redux";
import { createOffer } from "../utils/client";


import { addContact } from "../actions";

const UserItem = ({
  title,
  body,
  status,
  image,
  leftComponent,
  rightComponent,
  _id,
  user,
  addContact,
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
          {userData.contactsId[_id] ?
          (
            <PhoneOutlined
            onClick={() => {
              if(navigator.onLine){
                createOffer(_id, user.id, (e) => {
                  message.error(e)
                }) 
              }
              else{
                message.error("Sorry No Internet connection please retry again.", 5)
              }
          }}
            style={{ color: presetPrimaryColors.blue, fontSize: "25px" }}
          />
          ):
          (
            <Button icon={<UserAddOutlined />} onClick={() => addContact(_id, user.token)}>
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
  user: state.auth
});

export default connect(mapStateToProps, { addContact })(UserItem);
