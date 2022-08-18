const isLinkRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9]{2,}[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*/;
const isLink = (link) => isLinkRegex.test(link);
module.exports = { isLink, isLinkRegex };
