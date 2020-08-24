import moment from "moment";
import DateTimeFormat = Intl.DateTimeFormat;

export class CharacterHTML {

    /**
     * @param {object} character
     */
    static character(character: { id?: number|string|null, name?: string|null, content?: string|null, image?: string|null, created_at?: DateTimeFormat|null }) {
        // @ts-ignore
        return '<div class="col-md-4" id="characters-item">\n' +
            '    <div class="card mb-4 shadow-sm">\n' +
            '        <img src="/assets/img/characters/'+ character.image +'" alt="Image character '+ character.name +'" class="img-fluid">\n' +
            '        <div class="card-body">\n' +
            '            <h3 class="card-title">\n' +
            '                <strong>\n' +
            '                    '+ character.name + '\n' +
            '                </strong>\n' +
            '            </h3>\n' +
            '            <p class="card-text">'+ character.content +'</p>\n' +
            '            <div class="d-flex justify-content-between align-items-center">\n' +
            '                <div class="btn-group">\n' +
            '                    <a href="/character/show/'+ character.id +'" type="button" class="btn btn-sm btn-outline-secondary">View</a>\n' +
            '                </div>\n' +
            '                <small class="text-muted">\n' +
            '                    '+ moment(character.created_at).fromNow() +' \n' +
            '                </small>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>'
    }

    /**
     * @param {Array<object>} characters
     *
     * @return Array<string>
     */
    static setCharacter(characters: Array<object>): Array<string> {
        let charactersData: string[];
        charactersData = [];
        characters.forEach((character) => {
            charactersData.push(CharacterHTML.character(character))
        })
        return charactersData
    }

}