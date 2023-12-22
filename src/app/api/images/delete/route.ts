import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// TODO: auth
const handler = async (req: Request) => {
	try {
		const formData = await req.formData();

		const fileId = formData.get('fileId')?.toString();
		if (!fileId) {
			return NextResponse.json({ status: 'error', message: 'Złe żądanie' });
		}

		const photo = await prisma.extraPhoto.findFirst({
			where: { id: fileId },
		});
		if (!photo) {
			return NextResponse.json({ status: 'error', message: 'Złe żądanie' });
		}

		let isError = false;
		const response = await new Promise((resolve, reject) => {
			fetch(process.env.DELETE_URL!, {
				method: 'POST',
				body: JSON.stringify({
					path: photo.path,
					apiKey: process.env.UPLOAD_KEY!,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((res) => res.json())
				.then(async (res) => {
					const { status, data } = res;
					if (status === 'error') {
						reject(data);
					} else if (status === 'success') {
						await prisma.extraPhoto.delete({
							where: { id: fileId },
						});
						resolve('Zdjęcie usunięte!');
					}
				})
				.catch(() => reject('Błąd serwera (2)'));
		}).catch((error) => {
			isError = true;
			return error;
		});

		return NextResponse.json({
			status: isError ? 'error' : 'success',
			message: response,
		});
	} catch {
		return NextResponse.json({ status: 'error', message: 'Błąd serwera (2)' });
	}
};

export { handler as POST };
