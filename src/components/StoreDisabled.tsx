import React from 'react';

const StoreDisabled = () => {
  return (
    <div className="space-y-4 max-w-2xl tracking-wide text-xl">
      <p className="font-bold">Szanowni Klienci,</p>
      <p>
        Z przykrością informujemy, że z powodu remontu i modernizacji naszej firmy, wstrzymujemy przyjmowanie zamówień
        do <span className="font-extrabold text-primary text-nowrap">1 września 2024r</span>. Prace te są konieczne, aby
        móc oferować Państwu jeszcze lepsze usługi i produkty. Przepraszamy za wszelkie niedogodności i serdecznie
        zapraszamy do ponownego skorzystania z naszych usług po zakończeniu prac remontowych.
      </p>
      <p className="font-bold">Dziękujemy za zrozumienie i do zobaczenia wkrótce!</p>
    </div>
  );
};

export default StoreDisabled;
