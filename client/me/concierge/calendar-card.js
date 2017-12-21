/** @format */

/**
 * CalendarCard represents a day of schedulable concierge chats. Each card is expandable to
 * allow the user to select a specific time on the day. If the day has no availability, it will
 * not be expandable. When you stack a group of these cards together you'll get the scheduling
 * calendar view.
 */

/**
 * External dependencies
 */
import Gridicon from 'gridicons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { localize, moment } from 'i18n-calypso';
import config from 'config';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSelect from 'components/forms/form-select';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import { getLanguage } from 'lib/i18n-utils';
const defaultLanguage = getLanguage( config( 'i18n_default_locale_slug' ) ).name;

class CalendarCard extends Component {
	static propTypes = {
		date: PropTypes.number.isRequired,
		disabled: PropTypes.bool.isRequired,
		isDefaultLocale: PropTypes.bool.isRequired,
		onSubmit: PropTypes.func.isRequired,
		times: PropTypes.arrayOf( PropTypes.number ).isRequired,
		timezone: PropTypes.string.isRequired,
	};

	state = {
		selectedTime: this.props.times[ 0 ],
	};

	withTimezone = dateTime => moment( dateTime ).tz( this.props.timezone );

	/**
	 * Returns a string representing the day of the week, with certain dates using natural
	 * language like "Today" or "Tomorrow" instead of the name of the day.
	 *
	 * @param {Number} date Timestamp of the date
	 * @returns {String} The name for the day of the week
	 */
	getDayOfWeekString = date => {
		const { translate } = this.props;
		const today = this.withTimezone().startOf( 'day' );
		const dayOffset = today.diff( date.startOf( 'day' ), 'days' );

		switch ( dayOffset ) {
			case 0:
				return translate( 'Today' );
			case -1:
				return translate( 'Tomorrow' );
		}
		return date.format( 'dddd' );
	};

	renderHeader = () => {
		// The "Header" is that part of the foldable card that you click on to expand it.
		const date = this.withTimezone( this.props.date );

		return (
			<div className="concierge__calendar-card-header">
				<Gridicon icon="calendar" className="concierge__calendar-card-header-icon" />
				<span>
					<b>{ this.getDayOfWeekString( date ) } —</b> { date.format( ' MMMM D' ) }
				</span>
			</div>
		);
	};

	onChange = ( { target } ) => {
		this.setState( { selectedTime: target.value } );
	};

	submitForm = () => {
		this.props.onSubmit( this.state.selectedTime );
	};

	render() {
		const { disabled, isDefaultLocale, times, translate } = this.props;
		const description = isDefaultLocale
			? translate( 'Sessions are 30 minutes long.' )
			: translate( 'Sessions are 30 minutes long and in %(defaultLanguage)s.', {
					args: { defaultLanguage },
				} );

		return (
			<FoldableCard
				className="concierge__calendar-card"
				clickableHeader={ ! isEmpty( times ) }
				compact
				disabled={ isEmpty( times ) }
				summary={ isEmpty( times ) ? translate( 'No sessions available' ) : null }
				header={ this.renderHeader() }
			>
				<FormFieldset>
					<FormLabel htmlFor="concierge-start-time">
						{ translate( 'Choose a starting time' ) }
					</FormLabel>
					<FormSelect
						id="concierge-start-time"
						disabled={ disabled }
						onChange={ this.onChange }
						value={ this.state.selectedTime }
					>
						{ times.map( time => (
							<option value={ time } key={ time }>
								{ this.withTimezone( time ).format( 'h:mma z' ) }
							</option>
						) ) }
					</FormSelect>
					<FormSettingExplanation>{ description }</FormSettingExplanation>
				</FormFieldset>

				<FormFieldset>
					<Button disabled={ disabled } primary onClick={ this.submitForm }>
						{ translate( 'Book this session' ) }
					</Button>
				</FormFieldset>
			</FoldableCard>
		);
	}
}

export default localize( CalendarCard );
