export const alunoMenu = [
	{
		id: 1,
		icon: 'dashboard',
		text: 'O meu estado',
		link: '/dashboard',
		isGroup: false
	},
	{
		id: 2,
		icon: 'calendar',
		text: 'Caléndario',
		link: '/calendar',
		isGroup: false
	},
	{
		id: 3,
		icon: 'book',
		text: 'Notas',
		link: '/disciplines',
		isGroup: false
	},
	// {
	// 	id: 4,
	// 	icon: 'notification',
	// 	text: 'Notícias',
	// 	link: '/news',
	// 	isGroup: false
	// },
	// {
	// 	id: 5,
	// 	icon: 'clock-circle',
	// 	text: 'Horário',
	// 	link: '/schedule',
	// 	isGroup: false
	// },
	{
		id: 6,
		icon: 'schedule',
		text: 'Tarefas',
		link: '/homeworks',
		isGroup: false
	},
	{
		id: 8,
		icon: 'cloud',
		text: 'Armazenamento',
		link: '/storage',
		isGroup: false
	},
	{
		id: 7,
		icon: 'setting',
		text: 'Definições',
		link: '/settings',
		isGroup: false
	},
];

export const parenteMenu = [
	{
		id: 1,
		icon: 'dashboard',
		text: 'Estado do educando',
		link: '/dashboard',
		isGroup: false
	},
	{
		id: 2,
		icon: 'calendar',
		link: '/calendar',
		text: 'Caléndario',
		isGroup: false
	},
	{
		id: 3,
		icon: 'book',
		text: 'Notas',
		link: '/grades',
		isGroup: false
	},
	{
		id: 4,
		icon: 'setting',
		text: 'Definições',
		link: '/settings',
		isGroup: false
	},
];

export const professorMenu = [
	{
		id: 1,
		icon: 'team',
		text: 'Aula',
		link: '/lessons',
		isGroup: false
	},
	{
		id: 3,
		icon: 'book',
		text: 'Testes',
		link: '/tests',
		isGroup: true,
		group: [
			{
				id: 31,
				text: 'Alterar Notas',
				link: '/tests/grades',
				isSubItem: true
			},
			{
				id: 32,
				text: 'Marcar Testes',
				link: '/tests/calendar',
				isSubItem: true
			}
		]
	},
	// {
	// 	id: 3,
	// 	icon: 'clock-circle',
	// 	text: 'Horário',
	// 	link: '/schedule',
	// 	isGroup: false
	// },
	{
		id: 4,
		icon: 'schedule',
		text: 'Tarefas',
		link: '/homeworks',
		isGroup: false
	},
	{
		id: 5,
		icon: 'mail',
		text: 'Recados',
		link: '/message',
		isGroup: false
	},
	{
		id: 7,
		icon: 'cloud',
		text: 'Armazenamento',
		link: '/storage',
		isGroup: false
	},
	{
		id: 6,
		icon: 'setting',
		text: 'Definições',
		link: '/settings',
		isGroup: false
	},
];

export const classDirectorMenu = [
	{
		id: 1,
		icon: 'team',
		text: 'Direção de Turma',
		link: '/dashboard',
		isGroup: true,
		group: [
			{
				id: 11,
				text: 'Desempenho',
				link: '/dashboard/performance',
				isSubItem: true
			},
			{
				id: 12,
				text: 'Faltas',
				link: '/dashboard/absences',
				isSubItem: true
			}
		]
	},
	{
		id: 2,
		icon: 'team',
		text: 'Aula',
		link: '/lessons',
		isGroup: false
	},
	{
		id: 3,
		icon: 'book',
		text: 'Notas e Testes',
		link: '/tests',
		isGroup: true,
		group: [
			{
				id: 31,
				text: 'Alterar Notas dos Testes',
				link: '/tests/grades',
				isSubItem: true
			},
			{
				id: 32,
				text: 'Alterar Notas dos Módulos/UFCD',
				link: '/tests/module',
				isSubItem: true
			},
			{
				id: 33,
				text: 'Marcar Testes',
				link: '/tests/calendar',
				isSubItem: true
			}
		]
	},
	// {
	// 	id: 4,
	// 	icon: 'clock-circle',
	// 	text: 'Horário',
	// 	link: '/schedule',
	// 	isGroup: false
	// },
	{
		id: 5,
		icon: 'schedule',
		text: 'Tarefas',
		link: '/homeworks',
		isGroup: false
	},
	{
		id: 6,
		icon: 'mail',
		text: 'Recados',
		link: '/message',
		isGroup: false
	},
	{
		id: 8,
		icon: 'cloud',
		text: 'Armazenamento',
		link: '/storage',
		isGroup: false
	},
	{
		id: 7,
		icon: 'setting',
		text: 'Definições',
		link: '/settings',
		isGroup: false
	},
];

export const adminMenu = [
	{
		id: 1,
		icon: 'cloud',
		text: 'Armazenamento',
		link: '/storage',
		isGroup: false
	},
	{
		id: 2,
		icon: 'user',
		text: 'Contas de Utilizador',
		link: '/users',
		isGroup: false
	},
	{
		id: 3,
		icon: 'book',
		text: 'Turmas',
		link: '/classes',
		isGroup: false
	},
	{
		id: 4,
		icon: 'book',
		text: 'Cursos',
		link: '/courses',
		isGroup: false
	},
	{
		id: 5,
		icon: 'book',
		text: 'Disciplinas',
		link: '/disciplines',
		isGroup: false
	},
	{
		id: 6,
		icon: 'book',
		text: 'Módulos/UFCD',
		link: '/modules',
		isGroup: false
	},
	{
		id: 7,
		icon: 'setting',
		text: 'Definições',
		link: '/settings',
		isGroup: false
	},
];

