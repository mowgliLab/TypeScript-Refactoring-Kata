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
                        this.manageGenericType(currentItem, this.increaseQuality);
                        break;
                    case ItemTypeEnum.BackstagePasses:
                        this.manageBackstageType(currentItem);
                        break;
                    case ItemTypeEnum.Conjured:
                        this.manageGenericType(currentItem, i => this.decreaseQuality(i, 2));
                        break;
                    default:
                        this.manageGenericType(currentItem, this.decreaseQuality);
                        break;
                }
            }
        }

        return this.items;
    }

    /**
     * Get the type of item from the item name.
     * @param name
     */
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

    /**
     * Compute the new quality and check whether it could be decreased
     * @param quality
     * @param step
     */
    private decreaseQuality(quality: number, step = 1): number {
        return quality > 0 ? quality - step : quality;
    }

    /**
     * Compute the new quality and check whether it could be increased.
     * @param quality
     */
    private increaseQuality(quality: number): number {
        return quality < 50 ? quality + 1 : quality;
    }

    /**
     * Manage the computation of quality for backstage type.
     * @param item
     */
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

    /**
     * Group similar ways of managing quality.
     * @param item
     * @param updateQualityFunc : a function to compute the quality.
     */
    private manageGenericType(item: Item, updateQualityFunc: any) {
        item.quality = updateQualityFunc(item.quality);
        if (item.sellIn < 0) {
            item.quality = updateQualityFunc(item.quality);
        }
    }
}
