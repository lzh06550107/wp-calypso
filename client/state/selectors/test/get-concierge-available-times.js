/** @format */

/**
 * Internal dependencies
 */
import { getConciergeAvailableTimes } from 'state/selectors';

describe( 'getConciergeAvailableTimes()', () => {
	test( 'should be defaulted to null.', () => {
		expect( getConciergeAvailableTimes( {} ) ).toBeNull();
	} );

	test( 'should return the items field under the concierge shift state tree.', () => {
		const availableTimes = [
			Date.parse( '2017-01-01 08:00:00' ),
			Date.parse( '2017-01-01 09:00:00' ),
			Date.parse( '2017-01-01 10:00:00' ),
		];
		const state = {
			concierge: {
				availableTimes,
			},
		};

		expect( getConciergeAvailableTimes( state ) ).toEqual( availableTimes );
	} );
} );
