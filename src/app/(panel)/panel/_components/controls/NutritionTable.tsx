'use client';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn, errorToast, successToast } from '@/lib/utils';
import { NutritionFact, Product } from '@prisma/client';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IoOptions } from 'react-icons/io5';
import { useState } from 'react';

type TNutritionTable = {
	product: Product & {
		nutritionFact: NutritionFact | null;
	};
	refetch: () => void;
};
const NutritionTable = ({ product, refetch }: TNutritionTable) => {
	const { nutritionFact } = product;

	const calculate = (
		fat: number,
		protein: number,
		carbo: number,
		fiber: number,
		sodium: number,
		type: 'calories' | 'weight'
	) => {
		const value =
			type === 'calories'
				? fat * 9 + (protein + carbo) * 4 + fiber * 2
				: fat + protein + carbo + fiber + sodium;

		return isNaN(value) ? 0 : value;
	};

	const [data, setData] = useState({
		fat: nutritionFact?.fat ?? 0,
		carbohydrate: nutritionFact?.carbohydrate ?? 0,
		carbohydrateSugar: nutritionFact?.carbohydrateSugar ?? 0,
		fiber: nutritionFact?.fiber ?? 0,
		monounsaturatedFat: nutritionFact?.monounsaturatedFat ?? 0,
		polyunsaturatedFat: nutritionFact?.polyunsaturatedFat ?? 0,
		protein: nutritionFact?.protein ?? 0,
		saturatedFat: nutritionFact?.saturatedFat ?? 0,
		sodium: nutritionFact?.sodium ?? 0,
		totalCalories: calculate(
			nutritionFact?.fat ?? 0,
			nutritionFact?.protein ?? 0,
			nutritionFact?.carbohydrate ?? 0,
			nutritionFact?.fiber ?? 0,
			nutritionFact?.sodium ?? 0,
			'calories'
		),
		totalWeight: calculate(
			nutritionFact?.fat ?? 0,
			nutritionFact?.protein ?? 0,
			nutritionFact?.carbohydrate ?? 0,
			nutritionFact?.fiber ?? 0,
			nutritionFact?.sodium ?? 0,
			'weight'
		),
		status:
			(nutritionFact?.fat ?? 0) +
				(nutritionFact?.protein ?? 0) +
				(nutritionFact?.carbohydrate ?? 0) +
				(nutritionFact?.fiber ?? 0) ===
			100
				? 'OK'
				: 'Niepoprawna suma składników',
	});

	const handleChange = (newValue: string, field: keyof NutritionFact) => {
		const floatValue = parseFloat(newValue.replace(/[^\d.]/gi, ''));
		const value = isNaN(floatValue) ? 0 : floatValue;

		const carbo = field === 'carbohydrate' ? value : data.carbohydrate;
		const protein = field === 'protein' ? value : data.protein;
		const sodium = field === 'sodium' ? value : data.sodium;
		const fiber = field === 'fiber' ? value : data.fiber;
		const fat = field === 'fat' ? value : data.fat;
		const saturatedFat = field === 'saturatedFat' ? value : data.saturatedFat;
		const polyunsaturatedFat =
			field === 'polyunsaturatedFat' ? value : data.polyunsaturatedFat;
		const monounsaturatedFat =
			field === 'monounsaturatedFat' ? value : data.monounsaturatedFat;
		const carbohydrateSugar =
			field === 'carbohydrateSugar' ? value : data.carbohydrateSugar;

		const totalCalories = calculate(
			fat,
			protein,
			carbo,
			fiber,
			sodium,
			'calories'
		);
		const totalWeight = calculate(fat, protein, carbo, fiber, sodium, 'weight');

		let status = 'OK';

		if (totalWeight !== 100) {
			status = 'Niepoprawna suma składników';
		} else if (saturatedFat + polyunsaturatedFat + monounsaturatedFat > fat) {
			status = 'Niepoprawna suma tłuszczów';
		} else if (carbohydrateSugar > carbo) {
			status = 'Niepoprawna suma węglowodanów';
		}

		setData({
			...data,
			[field]: value,
			totalCalories,
			totalWeight,
			status,
		});
	};

	const { mutate: updateCalories, isLoading } =
		trpc.panel.updateCalories.useMutation({
			onSuccess: (message) => {
				if (message === 'OK') {
					successToast('Tabela zaktualizowana!');
					refetch();
				} else {
					errorToast(message);
				}
			},
			onError: () => errorToast(),
		});

	const onUpdate = () => {
		const {
			carbohydrate,
			carbohydrateSugar,
			fat,
			fiber,
			monounsaturatedFat,
			polyunsaturatedFat,
			protein,
			saturatedFat,
			sodium,
		} = data;
		updateCalories({
			productId: product.id,
			carbohydrate,
			carbohydrateSugar,
			fat,
			fiber,
			protein,
			sodium,
			monounsaturatedFat,
			polyunsaturatedFat,
			saturatedFat,
		});
	};

	return (
		<div>
			<div className='flex'>
				<IoOptions className='w-6 h-6 mr-2' />
				<h2 className='font-medium text-lg'>Wartości odżywcze</h2>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Wartość odżywcza</TableHead>
						<TableHead className='w-[275px]'>w 100g produktu</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Tłuszcz</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.fat}
								onChange={(e) => handleChange(e.target.value, 'fat')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>w tym:</TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='pl-8'>kwasy tłuszczowe nasycone</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.saturatedFat}
								onChange={(e) => handleChange(e.target.value, 'saturatedFat')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='pl-8'>
							kwasy tłuszczowe jednonienasycone
						</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.monounsaturatedFat}
								onChange={(e) =>
									handleChange(e.target.value, 'monounsaturatedFat')
								}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='pl-8'>
							kwasy tłuszczowe wielonienasycone
						</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.polyunsaturatedFat}
								onChange={(e) =>
									handleChange(e.target.value, 'polyunsaturatedFat')
								}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Węglowodany</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.carbohydrate}
								onChange={(e) => handleChange(e.target.value, 'carbohydrate')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='pl-8'>w tym cukry</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.carbohydrateSugar}
								onChange={(e) =>
									handleChange(e.target.value, 'carbohydrateSugar')
								}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Błonnik</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.fiber}
								onChange={(e) => handleChange(e.target.value, 'fiber')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Białko</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.protein}
								onChange={(e) => handleChange(e.target.value, 'protein')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Sól</TableCell>
						<TableCell>
							<Input
								type='number'
								value={data.sodium}
								onChange={(e) => handleChange(e.target.value, 'sodium')}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Obliczona kaloryczność</TableCell>
						<TableCell>{data.totalCalories} kcal</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Obliczona waga</TableCell>
						<TableCell>{data.totalWeight} g</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Status</TableCell>
						<TableCell
							className={cn(
								data.status !== 'OK' && 'text-destructive font-medium'
							)}
						>
							{data.status}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Button disabled={data.status !== 'OK' || isLoading} onClick={onUpdate}>
				Aktualizuj
			</Button>
		</div>
	);
};

export default NutritionTable;
