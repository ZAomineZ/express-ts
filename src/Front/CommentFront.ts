// @ts-ignore
class CommentFront {
    private btnReply: NodeListOf<HTMLButtonElement>;
    private content: HTMLTextAreaElement | null;
    private form: HTMLFontElement | null;
    private inputCharacter: HTMLInputElement | null;

    constructor() {
        this.btnReply = document.querySelectorAll('#btn-reply')
        this.content = document.querySelector('#content')
        this.form = document.querySelector('#form-commentFront')
        this.inputCharacter = document.querySelector('#characterID')
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
            const lastComment = response.data.lastComment
            const commentReplies = document.querySelector('#comment-replies-' + commentID)
            // @ts-ignore
            commentReplies.innerHTML += lastComment
            // @ts-ignore
            this.content?.value = ''
        }
    }
}

let comment = new CommentFront()
comment.init();