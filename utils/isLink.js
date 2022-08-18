const isLinkRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9]{2,}[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*/g;
const isLink = (link) => isLinkRegex.test(link);
module.exports = { isLink, isLinkRegex };
