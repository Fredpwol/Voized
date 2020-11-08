import React from "react";
import { Typography, Layout, Input } from "antd";
import { connect } from "react-redux";

import UserItem from "../../components/UserItem";
import Divider from "../../components/Divider";
import { searchUsers } from "../../actions";
import { getNameInitials } from "../../utils";

{/* <a href='https://www.freepik.com/vectors/coffee'>Coffee vector created by pch.vector - www.freepik.com</a> 
<a href='https://www.freepik.com/vectors/background'>Background vector created by tartila - www.freepik.com</a>*/}
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
        {userData.search.length !== 0 ? userData.search.map((result, index) => (
          <UserItem
            key={result.username+index}
            title={result.username}
            image={{
              src: result.profile_pic,
              bgColor: result.bg_color,
              Acronym: getNameInitials(result.username),
            }}
            _id={result._id}
            body={result.email}
          />
        )) : userData.contacts.map((contact, index) => (
            <UserItem
              key={contact.username+index}
              title={contact.username}
              image={{
                src: contact.profile_pic,
                bgColor: contact.bg_color,
                Acronym: getNameInitials(contact.username),
              }}
              _id={contact._id}
              body={contact.email}
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
