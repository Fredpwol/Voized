import React from "react";
import { Typography, Layout, Input } from "antd";
import { connect } from "react-redux";

import UserItem from "../../components/UserItem";
import Divider from "../../components/Divider";
import { searchUsers } from "../../actions";
import { getNameInitials } from "../../utils";

const Contact = ({ user, userData, searchUsers }) => {
  return (
    <div className="content-body">
      <Layout.Header className="content-head">
        <h1 className="title-text">Contacts</h1>
        <Input.Search
          placeholder="Type in to Search..."
          enterButton
          style={{ width: "40%" }}
          onChange={(e) => searchUsers(e.target.value, user.token)}
        />
      </Layout.Header>
      <Divider />
      <div style={{ paddingTop: "10px" }}>
        {userData.search.length !== 0 ? userData.search.map((user) => (
          <UserItem
            title={user.username}
            image={{
              src: user.profile_pic,
              bgColor: user.bg_color,
              _id:user.id,
              Acronym: getNameInitials(user.username),
            }}
            body={user.email}
          />
        )) : userData.contacts.map((user) => (
            <UserItem
              title={user.username}
              image={{
                src: user.profile_pic,
                bgColor: user.bg_color,
                _id:user.id,
                Acronym: getNameInitials(user.username),
              }}
              body={user.email}
            />)) }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
  userData: state.userData,
});

export default connect(mapStateToProps, { searchUsers })(Contact);
