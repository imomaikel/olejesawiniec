export const handlePrismaError = (error: any) => {
	try {
		const errorCode = error?.code;
		if (errorCode) {
			if (errorCode === 'P2002' || errorCode === 'P2025') {
				return 'Object already exists';
			} else {
				console.log('Unknown Prisma error code:', errorCode);
			}
		}
	} catch {}
	return 'Unknown error';
};
