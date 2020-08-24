class FilterCharacterFront {
    private nameFilter: HTMLButtonElement | null;
    private ageFilter: HTMLButtonElement | null;
    private sizeFilter: HTMLButtonElement | null;
    private recentFilter: HTMLButtonElement | null;
    private manFilter: HTMLButtonElement | null;
    private menFilter: HTMLButtonElement | null;
    private categoryFilter: NodeListOf<Element>;
    private charactersList: HTMLDivElement | null

    constructor() {
        this.nameFilter = document.querySelector('#name-filter')
        this.ageFilter = document.querySelector('#age-filter')
        this.sizeFilter = document.querySelector('#size-filter')
        this.recentFilter = document.querySelector('#recent-filter')
        this.manFilter = document.querySelector('#man-filter')
        this.menFilter = document.querySelector('#men-filter')
        this.categoryFilter = document.querySelectorAll('#category-filter')

        this.charactersList = document.querySelector('#characters-list')
    }

    /**
     * @param {Event} e
     * @param {string} typeFilter
     * @private
     */
    private async filter(e: Event, typeFilter: string) {
        e.preventDefault()

        let url = '/api/character/filter/' + typeFilter
        if (typeFilter === 'category') {
            let dataID: any;
            // @ts-ignore
            dataID = e.target.getAttribute('data-id');
            url = '/api/character/filterCategory/' + dataID
        }
        let response = await axios.post(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (response.data.success) {
            const characters = response.data.characters
            
            // @ts-ignore
            this.charactersList?.innerHTML = ''
            characters.forEach((character: string) => {
                // @ts-ignore
                this.charactersList?.innerHTML += character
            })
            let charactersItem = document.querySelectorAll('#characters-item')
            charactersItem.forEach((charactersItem) => {
                let contentCharacter = charactersItem.querySelector('.card-text')
                let valueContent = contentCharacter.innerHTML
                let newValue = valueContent.length >= 150 ? valueContent.slice(0, 150) + '...' : valueContent

                contentCharacter.innerHTML = newValue
            })
        }
    }

    public init() {
        this.nameFilter?.addEventListener('click', e => this.filter(e, 'name'))
        this.ageFilter?.addEventListener('click', e => this.filter(e, 'age'))
        this.sizeFilter?.addEventListener('click', e => this.filter(e, 'size'))
        this.recentFilter?.addEventListener('click', e => this.filter(e, 'created_at'))
        this.manFilter?.addEventListener('click', e => this.filter(e, 'homme'))
        this.menFilter?.addEventListener('click', e => this.filter(e, 'femme'))

        // Elements NODES
        this.categoryFilter.forEach((category) => {
            category.addEventListener('click', e => this.filter(e, 'category'))
        })
    }

}

let filterCharacter = new FilterCharacterFront()
filterCharacter.init()