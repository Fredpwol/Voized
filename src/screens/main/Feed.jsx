import React, {useState, useEffect} from "react";
import Header from "../../components/Header";

import { Table, Typography, Avatar } from "antd";
import { connect } from "react-redux";
import { getNameInitials } from "../../utils";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name < b.name,
    sortDirections: ["descend"],
    render: (user) => (
      <div style={{display:"flex"}}>
      <Avatar style={{backgroundColor: user.bg_color, marginRight:"10px"}} src={user.profile_pic} >
        {getNameInitials(user.username)}
      </Avatar>
      <p className="capitalize">{user.username}</p>
      </div>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      {
        text: "Missed",
        value: "missed",
      },
      {
        text: "Recieved",
        value: "recieved",
      },
    ],
    onFilter: (value, record) => record.status === value,
    defaultSortOrder: "descend",
    render: (status) => {
      const type = status === "missed" ? "danger" : "success"
      return(
      <Typography.Text type={type}>{status}</Typography.Text>
    )
  }
  },
  {
    title: "Type",
    dataIndex: "type",
    filters: [
      {
        text: "Outgoing",
        value: "outgoing",
      },
      {
        text: "Incoming",
        value: "incoming",
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.type === value,
  },
  {
    title: "Duration",
    dataIndex: "duration",
    render: (item) => (
      <Typography.Text>{Math.round(item / (60 *1000))} mins : { item % 60} secs </Typography.Text>
    )
  },
  {
    title: "Date",
    dataIndex: "date",
    render: (item) => (
      <Typography.Text>{new Date(item*1000).toLocaleString()}</Typography.Text>
    )
  },
];


function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const Feed = ({ callData, user }) => {
  const [calls, setCalls] = useState([]);
  console.log(callData.calls)
  useEffect(() => {
    let proccessCalls = callData.calls.map(call => {
      let name = call.receiver;
      let type = "outgoing"
      if (call.receiver._id == user.id){
        name = call.caller;
        type = "incoming"
      }
      return { name, type, key: call.id, date: call.at, status: call.status, duration: call.duration  }
    })
    setCalls(proccessCalls);
  },[callData, user])


  return (
    <div className="content-body">
      <Header title="Activities" />
      <div>
        <Table columns={columns} dataSource={calls} onChange={onChange} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
  callData: state.callData
});

export default connect(mapStateToProps,null)(Feed);
