import React, { useState } from "react";
import { Typography, Layout, Input, Image } from "antd";
import { connect } from "react-redux";

import UserItem from "../../components/UserItem";
import Divider from "../../components/Divider";
import Header from "../../components/Header";
import { searchUsers } from "../../actions";
import { getNameInitials } from "../../utils";
import ErrorImage from "../../assets/images/searchError.jpg";
import Empty from "../../assets/images/emptyContact.jpg";
import NotifyImage from "../../components/NotifyImage";

{/* <a href='https://www.freepik.com/vectors/coffee'>Coffee vector created by pch.vector - www.freepik.com</a> 
<a href='https://www.freepik.com/vectors/background'>Background vector created by tartila - www.freepik.com</a>*/}
const Contact = ({ user, userData, searchUsers }) => {
  const [search, setSearch] = useState("");
  return (
    <div className="content-body">
      <Header title="Contacts" leftComponent={( <Input.Search
          placeholder="Type in to Search..."
          enterButton
          style={{ width: "40%" }}
          onChange={(e) => {
            setSearch(e.target.value)
            searchUsers(e.target.value, user.token)
          }}
        />)} />
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
        )) : userData.contacts.length !== 0 ? userData.contacts.map((contact, index) => (
            search == "" ? (
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
            />
            ): 
            null
            )):(
              !search && <NotifyImage image={Empty} alt="No Contacts" title="You have no contacts search to add contacts" />
            )
           }
            {search !== "" & userData.search.length === 0 ? (
              <NotifyImage image={ErrorImage} alt="No Search Found" title={"No Search Found"} />
            ):null }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
  userData: state.userData,
});

export default connect(mapStateToProps, { searchUsers })(Contact);
