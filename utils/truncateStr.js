const truncateString = (str, maxLength = 85) => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
    }
    return str;
}

module.exports = truncateString