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

});
