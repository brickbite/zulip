var alert_words = (function () {

var exports = {};

exports.words = page_params.alert_words;

// Delete the `page_params.alert_words` since we are its sole user.
delete page_params.alert_words;

// escape_user_regex taken from jquery-ui/autocomplete.js,
// licensed under MIT license.
function escape_user_regex(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

exports.process_message = function (message) {
    // Parsing for alert words is expensive, so we rely on the host
    // to tell us there any alert words to even look for.
    if (!message.alerted) {
        return;
    }

    _.each(exports.words, function (word) {
        var clean = escape_user_regex(word);
        var regex = new RegExp('(?!<[^>]*?)' +
                               '(?!<span[^>]*?>)' +
                               '(' + clean + ')' +
                               '(?![^<]*?<\/span>)' +
                               '(?![^<]*?>)', 'ig');

        message.content = message.content.replace(regex, function (match, word, 
                                                                   offset, content) {
            return "<span class='alert-word'>" + word + "</span>";
        });
    });
};

exports.notifies = function (message) {
    // We exclude ourselves from notifications when we type one of our own
    // alert words into a message, just because that can be annoying for
    // certain types of workflows where everybody on your team, including
    // yourself, sets up an alert word to effectively mention the team.
    return !people.is_current_user(message.sender_email) && message.alerted;
};

return exports;

}());
if (typeof module !== 'undefined') {
    module.exports = alert_words;
}
