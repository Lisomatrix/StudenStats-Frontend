import React, { Component } from 'react';
import { Calendar, Modal } from 'antd';
import './../../styles/meals-calendar.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

var meals = [
	{ id: 1, day: 26, month: 8 - 1, year: 2018 },
	{ id: 2, day: 26, month: 7 - 1, year: 2018 },
	{ id: 3, day: 26, month: 6 - 1, year: 2018 },
	{ id: 4, day: 26, month: 8 - 1, year: 2018 }
];

function info(title, content) {
	Modal.info({
		title: title,
		content: <div>{content}</div>,
		onOk() {}
	});
}

function onSelect(value) {
	const foundMeals = [];

	const selectedDay = value.date();
	const selectedMonth = value.month();
	const selectedYear = value.year();

	meals.forEach((meal) => {
		if (selectedDay === meal.day && selectedMonth === meal.month && selectedYear === meal.year) {
			foundMeals.push(meal);
		}
	});

	if (foundMeals.length > 0) {
		const displayMeal = foundMeals.map((meal) => <p key={meal.id}>{meal.disciplina}</p>);

		info('Dia ' + selectedDay, displayMeal);
	}
}

function getMealData(value) {
	const day = value.date();
	const month = value.month();
	const year = value.year();

	var mealsNumber = 0;

	meals.forEach((meal) => {
		if (day === meal.day && month === meal.month && year === meal.year) {
			mealsNumber++;
		}
	});

	return mealsNumber;
}

function dateCellRender(value) {
	const mealsNumber = getMealData(value);

	return (
		<div className="meals-container">
			<span className="meals">{mealsNumber > 0 ? mealsNumber + ' Refeição' : null}</span>
		</div>
	);
}

class MealsCalendar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return <Calendar onSelect={onSelect} dateCellRender={dateCellRender} />;
	}
}

export default MealsCalendar;
