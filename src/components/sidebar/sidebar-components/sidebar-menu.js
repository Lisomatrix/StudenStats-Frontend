import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { alunoMenu, parenteMenu, professorMenu, classDirectorMenu, adminMenu } from './../../../constants/menus';
import { shallowEqual } from 'shouldcomponentupdate-children';

const SubMenu = Menu.SubMenu;

function getSubMenuItem(key, element) {

	return element.group.find((subElement) => {
		if (subElement.id === parseInt(key)) {
			return subElement;
		}
	});

}

function getMenuItem(key, elements) {

	const isSubItemKey = key > 10;
	const keyAsText = key.toString();
	const firstDigitText = keyAsText[0];

	const firstDigit = +(firstDigitText);

	var foundItem;

	elements.find((element) => {

		var item;

		if (isSubItemKey) {

			if (element.isGroup && element.id === firstDigit) {
				item = getSubMenuItem(key, element);
			}

		} else {
			if (element.id === parseInt(key)) {
				item = element;
			}
		}

		foundItem = item;
		return item;
	});

	return foundItem;
}

var menu;
var menuGenerated = false;

class SidebarMenu extends Component {

	navigate = (e) => {

		var route = null;

		if (this.props.role === 'ROLE_PROFESSOR') {
			if (this.props.isClassDirector) {
				route = getMenuItem(e.key, classDirectorMenu);
			} else {
				route = getMenuItem(e.key, professorMenu);
			}
		} else if (this.props.role === 'ROLE_ALUNO') {
			route = getMenuItem(e.key, alunoMenu);
		} else if (this.props.role === 'ROLE_PARENT') {
			route = getMenuItem(e.key, parenteMenu);
		} else if (this.props.role === 'ROLE_ADMIN') {
			route = getMenuItem(e.key, adminMenu);
		}

		if (route != null) {
			this.props.history.push(route.link);
		}
	};

	generateMenuRow = (element) => {

		return (
			<Menu.Item onClick={this.navigate} key={element.id}>
				<Icon type={element.icon} />
				<span>{element.text}</span>
			</Menu.Item>
		);
	};

	generateSubMenuRow = (element) => {

		var itemTitle = (
			<span>
				<Icon type={element.icon} />
				<span>{element.text}</span>
			</span>
		);

		var subItems = element.group.map((subElement) => {
			return (
				<Menu.Item onClick={this.navigate} key={subElement.id}>
					{subElement.text}
				</Menu.Item>
			);
		});

		var subMenuRow = (
			<SubMenu key={element.id} title={itemTitle}>
				{subItems}
			</SubMenu>
		);

		return subMenuRow;
	};

	getStudentMenu = () => {
		return alunoMenu.map((element) => {

			var item;

			if (element.isGroup) {

				item = this.generateSubMenuRow(element);

			} else {

				item = this.generateMenuRow(element);
			}

			return item;
		});
	};

	getTeacherMenu = () => {
		return professorMenu.map((element) => {

			var item;

			if (element.isGroup) {
				item = this.generateSubMenuRow(element);
			} else {
				item = this.generateMenuRow(element);
			}

			return item;
		});
	}

	getClassDirectorMenu = () => {
		return classDirectorMenu.map((element) => {

			var item;

			if (element.isGroup) {
				item = this.generateSubMenuRow(element);
			} else {
				item = this.generateMenuRow(element);
			}

			return item;
		});
	}

	getParentMenu = () => {
		return parenteMenu.map((element) => {

			var item;

			if (element.isGroup) {
				item = this.generateSubMenuRow(element);
			} else {
				item = this.generateMenuRow(element);
			}

			return item;
		});
	}

	getAdminMenu = () => {
		return adminMenu.map((element) => {
			var item;

			if (element.isGroup) {
				item = this.generateSubMenuRow(element);
			} else {
				item = this.generateMenuRow(element);
			}

			return item;
		});
	}

	render() {
		var menu;

		if (this.props.role) {
			if (this.props.role === 'ROLE_ALUNO') {
				menu = this.getStudentMenu();
			} else if (this.props.role === 'ROLE_PROFESSOR') {
				if (this.props.isClassDirector) {
					menu = this.getClassDirectorMenu();
				} else {
					menu = this.getTeacherMenu();
				}
			} else if (this.props.role === 'ROLE_PARENT') {
				menu = this.getParentMenu();
			} else if (this.props.role === 'ROLE_ADMIN') {
				menu = this.getAdminMenu();
			}
		}



		return (
			<Menu
				onClick={this.props.onKeyClick}
				style={{ height: '95%', borderColor: 'transparent' }}
				className="menu-left-align"
				theme={this.props.theme}
				mode="inline"
				selectedKeys={this.props.selectedKey}
				defaultSelectedKeys={['1']}
			>
				{menu}
			</Menu>
		);
	}
}

export default SidebarMenu;
