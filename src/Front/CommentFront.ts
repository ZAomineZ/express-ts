// @ts-ignore
class CommentFront {
    private btnReply: NodeListOf<HTMLButtonElement>;
    private content: HTMLTextAreaElement | null;
    private form: HTMLFontElement | null;
    private readonly paramsURL: URLSearchParams;
    private inputCharacter: HTMLInputElement | null;

    constructor() {
        this.btnReply = document.querySelectorAll('#btn-reply')
        this.content = document.querySelector('#content')
        this.form = document.querySelector('#form-commentFront')
        this.inputCharacter = document.querySelector('#characterID')
        this.paramsURL = new URLSearchParams()
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

        return this.form?.addEventListener('submit', this.submitComment.bind(this))
    }

    /**
     *
     * @param {Event} e
     * @private
     */
    private async submitComment(e: Event) {
        e.preventDefault()

        // @ts-ignore
        const content = this.content.value
        this.paramsURL.append('content', content);

        // @ts-ignore
        let request = await fetch('/api/character/show/reply/' + this.inputCharacter.value, {
            method: 'POST',
            body: this.paramsURL,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        })
        if (request.status === 200 || request.status === 302) {
            const response = await request.json()
        }
    }
}

let comment = new CommentFront()
comment.init();