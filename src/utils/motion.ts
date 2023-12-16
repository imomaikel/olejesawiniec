type TTransition = 'decay' | 'spring' | 'keyframes' | 'tween' | 'inertia';

export const container = {
	hidden: {},
	show: {
		transition: {
			delayChildren: 0.5,
		},
	},
};

export const zoomOut = (delay: number, duration: number) => ({
	hidden: {
		scale: 1.2,
		opacity: 0,
	},
	show: {
		scale: 1,
		opacity: 1,
		transition: {
			type: 'tween',
			delay,
			duration,
			ease: 'easeOut',
		},
	},
});

export const slideIn = (
	direction: 'top' | 'right' | 'bottom' | 'left',
	type: TTransition,
	delay: number,
	duration: number,
	value?: number
) => ({
	hidden: {
		x:
			direction === 'right'
				? `${value ?? 100}%`
				: direction === 'left'
				? `-${value ?? 100}%`
				: 0,
		y:
			direction === 'top'
				? `${value ?? 100}%`
				: direction === 'bottom'
				? `-${value ?? 100}%`
				: 0,
	},
	show: {
		x: 0,
		y: 0,
		transition: {
			type,
			delay,
			duration,
			ease: 'easeOut',
		},
	},
});
