import React from "react";

class Timer extends React.Component {

  constructor(props){
    super(props);
    this.state = {seconds: 0, minutes: 0, hours: 0};
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      let d = new Date(Date.now() - this.props.start);
      this.setState({ hours: d.getHours() - 1, minutes: d.getMinutes(), seconds: d.getSeconds()})
      }, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }
  
  zFormat = (string) => {
    let res = string.toString();
    if (res.length < 2) {
      res = "0" + res;
    }
    return res;
  };

  render(){
    return (
      <div style={this.props.style}>
      {`${this.zFormat(this.state.hours)}:${this.zFormat(this.state.minutes)}:${this.zFormat(this.state.seconds)}`}
    </div>
    )
  }
}
export default Timer;
