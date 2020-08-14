import WarframeItems = require('warframe-items')

export default class Items {

    /**
     * @return {String}
     */
    static getFirstItem () {
        const items = new WarframeItems({
            category: ['Primary']
        })
        return this.showItemName(items[0])
    }

    static showItemName (item: WarframeItem): string {
        return item.name
    }
}
