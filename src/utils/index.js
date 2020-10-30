import { presetPrimaryColors } from "@ant-design/colors";

export const getNameInitials = (name) => {
  let initials = [];
  if (name) {
    let nameList = name.split(" ");
    nameList.forEach((name) => {
      initials.push(name[0].toUpperCase());
    });
  }
  return initials.join("");
};

export const getRandomColor = () => {
  const colors = [
    "blue",
    "red",
    "green",
    "orange",
    "cyan",
    "gold",
    "geekblue",
    "purple",
    "lime",
    "magenta",
    "volcano",
    "yellow",
    "grey",
  ];
  let index = Math.floor(Math.random() * colors.length);
  let color = colors[index];
  return presetPrimaryColors[color];
};
