import {Item} from "./models/item";
import {ItemTypeEnum} from "./enums/ItemType.enum";

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            const currentItem = this.items[i];

            // If sulfura, do nothing
            if (currentItem.name.indexOf(ItemTypeEnum.Sulfuras) < 0) {
                currentItem.sellIn = currentItem.sellIn - 1;

                // Normal case (decreasing case)
                if (currentItem.name != 'Aged Brie' && currentItem.name != 'Backstage passes to a TAFKAL80ETC concert') {
                    // Don't pass under 0 quality.
                    if (currentItem.quality > 0) {
                        currentItem.quality = currentItem.quality - 1
                    }
                } else {
                    // Other cases (increasing)
                    // don't go above 50
                    if (currentItem.quality < 50) {
                        currentItem.quality = currentItem.quality + 1;
                        if (currentItem.name == 'Backstage passes to a TAFKAL80ETC concert') {
                            // If backstage and less than 10 days, increase once more (+2)
                            if (currentItem.sellIn < 11) {
                                if (currentItem.quality < 50) {
                                    currentItem.quality = currentItem.quality + 1
                                }
                            }
                            // If backstage and less than 5 days, increase once more (+3)
                            if (currentItem.sellIn < 6) {
                                if (currentItem.quality < 50) {
                                    currentItem.quality = currentItem.quality + 1
                                }
                            }
                        }
                    }
                }

                // case when sell in is less than 0
                if (currentItem.sellIn < 0) {
                    if (currentItem.name != 'Aged Brie') {
                        if (currentItem.name != 'Backstage passes to a TAFKAL80ETC concert') {
                            // Normal case decrease once more (-2)
                            if (currentItem.quality > 0) {
                                currentItem.quality = currentItem.quality - 1
                            }
                        } else {
                            // backstage, set to zero if date is passed.
                            currentItem.quality = currentItem.quality - currentItem.quality
                        }
                    } else {
                        // case of aged brie increase once more if less than 50 (+2)
                        if (currentItem.quality < 50) {
                            currentItem.quality = currentItem.quality + 1
                        }
                    }
                }
            }
        }

        return this.items;
    }
}
