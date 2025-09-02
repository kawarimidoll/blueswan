const visibilities = ["show", "hover", "hide"];

const names = [
  "replies",
  "reposts",
  "likes",
  "followers",
  "following",
  "posts",
  "messages",
  "notifications",
  "notifications-list",
  "suggested-for-you",
  "blueswan",
];

function ensureValue(value) {
  return visibilities.includes(value) ? value : "show";
}
