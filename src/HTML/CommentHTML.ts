import moment from "moment";
import DateTimeFormat = Intl.DateTimeFormat;

export class CommentHTML {

    /**
     * @param {object|null} reply
     */
    static commentReply(reply?: { id?: string | number | null, nameUser?: string | null, dateComment?: DateTimeFormat | null, content?: string | null }) {
        return '<div id="reply-' + reply?.id + '" class="pl-5">\n' +
            '<div class="comment">\n' +
            '    <div class="comment-header">\n' +
            '        <img class="avatar" src="https://www.gravatar.com/avatar/af00fe52b1b759393f4d43c641e8bf91"\n' +
            '             alt="Image Gravatar">\n' +
            '        <h1>' + reply?.nameUser + ' dit –</h1>\n' +
            '        <span>\n' +
            '            ' + moment(reply?.dateComment).format('MMMM Do YYYY') + '\n' +
            '        </span>\n' +
            '    </div>\n' +
            '    <p></p>\n' +
            '    <p>\n' +
            '        ' + reply?.content + '\n' +
            '    </p>\n' +
            '</div>'
        ' </div>'
    }

}