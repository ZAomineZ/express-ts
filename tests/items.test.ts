// @ts-ignore
import Items from '../src/items'

describe('Items', function () {
    it('should return the first item', function () {
        expect(Items.getFirstItem()).toBe('Acceltra')
    })
})
