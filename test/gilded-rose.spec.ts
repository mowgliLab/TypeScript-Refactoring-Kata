import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', function () {

    describe('NORMAL ITEMS CASES', function() {
        it('should quality decrease normally if day has not passed', function() {
            const normalItem = new Item("+5 Dexterity Vest", 10, 20);
            const gildedRose = new GildedRose([normalItem]);
            const initialValue = normalItem.quality;
            gildedRose.updateQuality();
            expect(initialValue - normalItem.quality).to.equal(1);
        });

        // Once the sell by date has passed, Quality degrades twice as fast
        it('should quality decrease twice faster if day has passed', function() {
            const normalItem = new Item("+5 Dexterity Vest", 0, 20);
            const gildedRose = new GildedRose([normalItem]);
            const initialValue = normalItem.quality;
            gildedRose.updateQuality();
            expect(initialValue - normalItem.quality).to.equal(2);
        });

        // The Quality of an item is never negative
        it('should quality never been negative', function() {
            const normalItem = new Item("+5 Dexterity Vest", 10, 0);
            const gildedRose = new GildedRose([normalItem]);
            gildedRose.updateQuality();
            expect(normalItem.quality).to.equal(0);
        });
    });

    describe('AGED BRIE CASES', function () {
        // "Aged Brie" actually increases in Quality the older it gets
        it('should increase quality with time', function () {
            const brieItem = new Item("Aged Brie", 2, 0);
            const gildedRose = new GildedRose([brieItem]);
            const initialValue = brieItem.quality;
            gildedRose.updateQuality();
            expect(initialValue - brieItem.quality).to.equal(-1);
        });

        // The Quality of an item is never more than 50
        it('should quality never be more than 50', function () {
            const brieItem = new Item("Aged Brie", 2, 50);
            const gildedRose = new GildedRose([brieItem]);
            gildedRose.updateQuality();
            expect(brieItem.quality).to.equal(50);
        });
    });

    describe('SULFURA CASES', function () {
        // "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
        it('should days and quality not moving', function () {
            const sulfuraItem = new Item("Sulfuras, Hand of Ragnaros", 2, 80);
            const gildedRose = new GildedRose([sulfuraItem]);
            const initialQuality = sulfuraItem.quality;
            const initialDays = sulfuraItem.sellIn;
            gildedRose.updateQuality();
            expect(initialQuality - sulfuraItem.quality).to.equal(0);
            expect(initialDays - sulfuraItem.sellIn).to.equal(0);
        });
    });

});
