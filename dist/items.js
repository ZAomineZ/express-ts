"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WarframeItems = require("warframe-items");
class Items {
    /**
     * @return {String}
     */
    static getFirstItem() {
        const items = new WarframeItems({
            category: ['Primary']
        });
        return this.showItemName(items[0]);
    }
    static showItemName(item) {
        return item.name;
    }
}
exports.default = Items;
