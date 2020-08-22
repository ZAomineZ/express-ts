// @ts-ignore
class CommentFront {
    private btnReply: NodeListOf<HTMLButtonElement>;
    private content: HTMLTextAreaElement | null;
    private form: HTMLFontElement | null;
    private inputCharacter: HTMLInputElement | null;
    private replyComments: HTMLDivElement | null;

    constructor() {
        this.btnReply = document.querySelectorAll('#btn-reply')
        this.content = document.querySelector('#content')
        this.form = document.querySelector('#form-commentFront')
        this.inputCharacter = document.querySelector('#characterID')
        this.replyComments = document.querySelector('#reply')
    }

    public init() {
        this.btnReply.forEach((btn) => {
            btn.addEventListener('click', this.hrefLocation.bind(this))
        })
    }

    /**
     * @param {Event} e
     * @private
     *
     * @return void
     */
    private hrefLocation(e: Event): void {
        e.preventDefault()

        const location = window.location
        window.location.href = location.origin + location.pathname + '#' + this.content?.getAttribute('id')

        // @ts-ignore
        const commendID = e.target.getAttribute('data-comment-id')
        return this.form?.addEventListener('submit', e => this.submitComment(e, commendID))
    }

    /**
     * @param {Event} e
     * @param {string} commentID
     * @private
     */
    private async submitComment(e: Event, commentID: string) {
        e.preventDefault()

        // @ts-ignore
        const content = this.content.value
        // @ts-ignore
        const url = '/api/character/show/' + this.inputCharacter.value + '/reply/' + commentID
        // @ts-ignore
        let response = await axios.post(url, content, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (response.data.success) {
            const lastComment = response.data.lastComment[0]
            // @ts-ignore
            this.replyComments?.innerHTML += this.commentReply(lastComment, moment)
        }
    }

    /**
     * @param {object|null} comment
     * @param {object|null} moment
     * @private
     */
    private commentReply(comment?: { id: number | null, nameUser?: string | null, dateComment?: object | null, content?: string | null }, moment?: object) {
        if (comment) {
            return (`
            <div id="reply-${comment.id}" class="pl-5">
                <div class="comment">
                    <div class="comment-header">
                        <img class="avatar" src="https://www.gravatar.com/avatar/af00fe52b1b759393f4d43c641e8bf91"
                             alt="Image Gravatar">
                        <h1>${comment.nameUser ? comment.nameUser : null} dit –</h1>
                        <span>
                            ${comment.dateComment}
                        </span>
                    </div>
                    <p></p>
                    <p>
                        ${comment.content}
                    </p>
                    <p></p>
                <button class="btn btn-secondary" id="btn-reply" data-comment-id="<%= commentFront.id %>">💬 Répondre</button>
             </div>
            </div>
        `)
        }
    }
}

let comment = new CommentFront()
comment.init();