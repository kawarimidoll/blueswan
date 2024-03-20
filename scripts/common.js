const visibilities = ["show", "hover", "hide"];

const names = [
  "replys",
  "reposts",
  "likes",
  "followers",
  "following",
  "posts",
  "notifications",
  "notifications-list",
  "blueswan",
];

function ensureValue(value) {
  return visibilities.includes(value) ? value : "show";
}
