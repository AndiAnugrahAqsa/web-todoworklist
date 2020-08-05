exports.getDate = function() {
    const today = new Date;
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    var day = today.toLocaleDateString("en-US", options);

    return day;
};

exports.getDay = function() {
    const today = new Date;
    const options = {
        weekday: 'long'
    }
    var day = today.toLocaleDateString("en-US", options);

    return day;
};