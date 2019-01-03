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

            // If sulfuras, do nothing
            if (itemType !== ItemTypeEnum.Sulfuras) {
                currentItem.sellIn = currentItem.sellIn - 1;
                switch (itemType) {
                    case ItemTypeEnum.AgedBrie:
                        this.manageAgedBrieType(currentItem);
                        break;
                    case ItemTypeEnum.BackstagePasses:
                        this.manageBackstageType(currentItem);
                        break;
                    case ItemTypeEnum.Conjured:
                        this.manageConjuredType(currentItem);
                        break;
                    default:
                        this.manageNormalType(currentItem);
                        break;
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

    private manageBackstageType(item: Item) {
        if (item.sellIn < 0) {
            item.quality = 0;
        } else {
            item.quality = this.increaseQuality(item.quality);
            // If backstage and less than 10 days, increase once more (+2)
            if (item.sellIn < 11) {
                item.quality = this.increaseQuality(item.quality);
                // If backstage and less than 5 days, increase once more (+3)
                if (item.sellIn < 6) {
                    item.quality = this.increaseQuality(item.quality);
                }
            }
        }
    }

    private manageAgedBrieType(item: Item) {
        item.quality = this.increaseQuality(item.quality);
        if (item.sellIn < 0) {
            item.quality = this.increaseQuality(item.quality);
        }
    }

    private manageNormalType(item: Item) {
        item.quality = this.decreaseQuality(item.quality);
        if (item.sellIn < 0) {
            item.quality = this.decreaseQuality(item.quality);
        }
    }

    private manageConjuredType(item: Item) {
        item.quality = this.decreaseQuality(item.quality);
        item.quality = this.decreaseQuality(item.quality);
        if (item.sellIn < 0) {
            item.quality = this.decreaseQuality(item.quality);
            item.quality = this.decreaseQuality(item.quality);
        }
    }
}
