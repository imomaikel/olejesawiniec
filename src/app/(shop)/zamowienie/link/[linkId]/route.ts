import { redirect } from 'next/navigation';

const handler = async (req: Request) => {
  const pathArr = req.url.split('/');
  const linkId = pathArr.pop();

  if (!linkId || linkId.length <= 3) {
    return redirect('/sklep');
  }

  const paymentLink = await prisma.paymentLink.findUnique({
    where: { id: linkId },
  });

  if (!paymentLink || !paymentLink.cashbillId) {
    return redirect('/sklep');
  }

  await prisma.paymentLink.delete({
    where: { id: paymentLink.id },
  });

  redirect(`/zamowienie/${paymentLink.cashbillId}`);
};

export { handler as GET };
