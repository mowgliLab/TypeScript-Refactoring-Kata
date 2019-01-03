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
            const itemType = this.getItemType(currentItem.name);

            // If sulfura, do nothing
            if (itemType !== ItemTypeEnum.Sulfuras) {
                currentItem.sellIn = currentItem.sellIn - 1;

                // Normal case (decreasing case)
                if (itemType === ItemTypeEnum.Normal) {
                    // Don't pass under 0 quality.
                    currentItem.quality = this.decreaseQuality(currentItem.quality);
                } else {
                    // Other cases (increasing)
                    // don't go above 50
                    if (currentItem.quality < 50) {
                        currentItem.quality = currentItem.quality + 1;
                        if (itemType === ItemTypeEnum.BackstagePasses) {
                            // If backstage and less than 10 days, increase once more (+2)
                            if (currentItem.sellIn < 11) {
                                currentItem.quality = this.increaseQuality(currentItem.quality);
                                // If backstage and less than 5 days, increase once more (+3)
                                if (currentItem.sellIn < 6) {
                                    currentItem.quality = this.increaseQuality(currentItem.quality);
                                }
                            }
                        }
                    }
                }

                // case when sell in is less than 0
                if (currentItem.sellIn < 0) {
                    if (itemType !== ItemTypeEnum.AgedBrie) {
                        if (itemType === ItemTypeEnum.Normal) {
                            // Normal case decrease once more (-2)
                            currentItem.quality = this.decreaseQuality(currentItem.quality);
                        } else {
                            // backstage, set to zero if date is passed.
                            currentItem.quality = currentItem.quality - currentItem.quality
                        }
                    } else {
                        // case of aged brie increase once more if less than 50 (+2)
                        currentItem.quality = this.increaseQuality(currentItem.quality);
                    }
                }
            }
        }

        return this.items;
    }

    private getItemType(name: string): ItemTypeEnum {
        if (name.indexOf(ItemTypeEnum.Sulfuras) > -1) {
            return ItemTypeEnum.Sulfuras;
        } else if (name.indexOf(ItemTypeEnum.AgedBrie) > -1) {
            return ItemTypeEnum.AgedBrie;
        } else if (name.indexOf(ItemTypeEnum.BackstagePasses) > -1) {
            return ItemTypeEnum.BackstagePasses
        } else if (name.indexOf(ItemTypeEnum.Conjured) > -1) {
            return ItemTypeEnum.Conjured
        } else {
            return ItemTypeEnum.Normal;
        }
    }

    private decreaseQuality(quality: number): number {
        return quality > 0 ? quality - 1 : quality;
    }

    private increaseQuality(quality: number): number {
        return quality < 50 ? quality + 1 : quality;
    }
}
