import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="py-12 px-8 md:px-12 flex relative max-w-[1920px] w-full justify-center mx-auto">
      <div className="flex flex-col max-w-screen-lg space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-center flex flex-col mb-2">
            <span>POLITYKA PRYWATNOŚCI STRONY INTERNETOWEJ</span> <span>(ANNA SAWINIEC)</span>
          </h1>
          <p className="text-muted-foreground text-center mb-4">Z dnia 26.03.2024r</p>
          <ol className="list-decimal text-justify ml-4">
            <li>
              Dla Właściciela niniejszej strony internetowej, ochrona danych osobowych Użytkowników jest sprawą
              najwyższej wagi. Dokłada on ogrom starań, aby Użytkownicy czuli się bezpiecznie, powierzając swoje dane
              osobowe w trakcie korzystania ze strony internetowej.
            </li>
            <li>
              Użytkownik to osoba fizyczna, osoba prawna albo jednostka organizacyjna, nieposiadająca osobowości
              prawnej, której ustawa przyznaje zdolność prawną, korzystająca z usług elektronicznych, dostępnych w
              ramach strony internetowej.
            </li>
            <li>
              Niniejsza polityka prywatności wyjaśnia zasady i zakres przetwarzania danych osobowych Użytkownika,
              przysługujące mu prawa, jak też obowiązki administratora tych danych, a także informuje o używaniu plików
              cookies.
            </li>
            <li>
              Administrator stosuje najnowocześniejsze środki techniczne i rozwiązania organizacyjne, zapewniające
              wysoki poziom ochrony przetwarzanych danych osobowych oraz zabezpieczenia przed dostępem osób
              nieupoważnionych.
            </li>
          </ol>
        </div>

        <ol className="space-y-4 list-[upper-roman]">
          {/* I */}
          <li className="marker:font-bold">
            <h2 className="font-bold">ADMINISTRATOR DANYCH OSOBOWYCH</h2>
            <p>
              <span>
                Administratorem danych osobowych jest Pani Anna Sawiniec, zamieszkała przy: Cześniki kolonia 26 (zwany
                dalej: &bdquo;
              </span>
              <span className="font-semibold">Właściciel</span>
              <span>&quot;).</span>
            </p>
          </li>

          {/* II */}
          <li className="marker:font-bold">
            <h2 className="font-bold">CEL PRZETWARZANIA DANYCH OSOBOWYCH</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <div className="flex flex-col">
                  <span>Administrator przetwarza dane osobowe Użytkownika w celu:</span>
                  <ul className="list-disc ml-4">
                    <li>
                      <span>W celu wysłania za pomocą kuriera produktów zakupionych przez klienta.</span>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <span>Oznacza to, że dane te są potrzebne w szczególności do</span>
                <ol className="list-[lower-latin] text-justify ml-4">
                  <li>
                    <span>zarejestrowania się na stronie internetowej;</span>
                  </li>
                  <li>
                    <span>zawarcia umowy;</span>
                  </li>
                  <li>
                    <span>dokonania rozliczeń;</span>
                  </li>
                  <li>
                    <span>dostarczenia zamówionego przez Użytkownika towaru lub wykonanie usług;</span>
                  </li>
                  <li>
                    <span>
                      korzystania przez Użytkownika z wszelkich uprawnień konsumenckich (np. odstąpienie od umowy,
                      rękojmia).
                    </span>
                  </li>
                </ol>
              </li>
              <li>
                <span>
                  Użytkownik może również wyrazić zgodę na otrzymywanie informacji o nowościach i promocjach, co
                  spowoduje, że administrator będzie również przetwarzać dane osobowe, w celu przesyłania Użytkownikowi
                  informacji handlowych, dotyczących m.in. nowych produktów lub usług, promocji czy wyprzedaży.
                </span>
              </li>
              <li>
                <span>
                  Dane osobowe są również przetwarzane w ramach wypełnienia prawnych obowiązków, ciążących na
                  administratorze danych oraz realizacji zadań, w interesie publicznym m.in. do wykonywania podatkowej.
                </span>
              </li>
              <li>
                <span>
                  Dane osobowe mogą być również przetwarzane w celach marketingu bezpośredniego produktów,
                  zabezpieczenia i dochodzenia roszczeń lub ochrony przed roszczeniami Użytkownika lub osoby trzeciej,
                  jak również marketingu usług i produktów podmiotów trzecich lub marketingu własnego, niebędącego
                  marketingiem bezpośrednim.
                </span>
              </li>
            </ol>
          </li>

          {/* III */}
          <li className="marker:font-bold">
            <h2 className="font-bold">RODZAJ DANYCH</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>Administrator przetwarza następujące dane osobowe, których podanie jest niezbędne do:</span>
                <ol className="list-[lower-latin] text-justify ml-4">
                  <li>
                    <span>zarejestrowania się na stronie internetowej:</span>
                    <ul className="list-disc ml-4">
                      <li>
                        <span>imię i nazwisko</span>
                      </li>
                      <li>
                        <span>adres e-mail</span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span>dokonywania zakupów za pomocą strony internetowej:</span>
                    <ul className="list-disc ml-4">
                      <li>
                        <span>imię i nazwisko </span>
                      </li>
                      <li>
                        <span>płeć </span>
                      </li>
                      <li>
                        <span>adres dostawy </span>
                      </li>
                      <li>
                        <span>numer telefonu </span>
                      </li>
                      <li>
                        <span>adres e-mail </span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span>Dane podawane przez Użytkownika opcjonalnie:</span>
                    <ul className="list-disc ml-4">
                      <li>
                        <span>data urodzenia </span>
                      </li>
                      <li>
                        <span>numer PESEL (w przypadku żądania wystawienia faktury) </span>
                      </li>
                      <li>
                        <span>numer NIP (w przypadku żądania wystawienia faktury dla przedsiębiorcy) </span>
                      </li>
                    </ul>
                  </li>
                </ol>
              </li>
              <li>
                <span>
                  W przypadku odstąpienia od umowy bądź uznania reklamacji, gdy zwrot należności następuje bezpośrednio
                  na rachunek bankowy Użytkownika, w celu dokonania zwrotu należności przetwarzamy również informacje,
                  dotyczące numeru rachunku bankowego.
                </span>
              </li>
            </ol>
          </li>

          {/* IV */}
          <li className="marker:font-bold">
            <h2 className="font-bold">PODSTAWA PRAWNA PRZETWARZANIA DANYCH OSOBOWYCH</h2>

            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  Dane osobowe są przetwarzane zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE)
                  2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem
                  danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE
                  (ogólne rozporządzenie o ochronie danych), Dz.Urz.UE L 119, 4.5.2016, str. 1&ndash;88, dalej zwane:
                  &bdquo; <span className="font-semibold">rozporządzenie RODO</span> &quot;.
                </span>
              </li>
              <li>
                <span>
                  Administrator przetwarza dane osobowe wyłącznie po uprzednim uzyskaniu zgody Użytkownika, wyrażonej w
                  chwili rejestracji na stronie internetowej lub w chwili potwierdzenia dokonanej na stronie
                  internetowej transakcji.
                </span>
              </li>
              <li>
                <span>
                  Wyrażenie zgody na przetwarzanie danych osobowych jest całkowicie dobrowolne, jednakże brak jej
                  udzielenia uniemożliwia zarejestrowanie się na stronie internetowej oraz dokonywanie zakupów, za
                  pośrednictwem strony internetowej.
                </span>
              </li>
            </ol>
          </li>

          {/* V */}
          <li className="marker:font-bold">
            <h2 className="font-bold">PRAWA PRZYSŁUGUJĄCE UŻYTKOWNIKOWI</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  Użytkownik może w każdej chwili zażądać od administratora informacji o zakresie przetwarzania danych
                  osobowych.
                </span>
              </li>
              <li>
                <span>
                  {/* TODO */}
                  Użytkownik może w każdej chwili zażądać poprawienia bądź sprostowania swoich danych osobowych.
                  Użytkownik może to również zrobić samodzielnie, po zalogowaniu się na swoje konto.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może w każdej chwili wycofać swoją zgodę na przetwarzanie jego danych osobowych, bez
                  podawania przyczyny. Żądanie nieprzetwarzania danych może dotyczyć wskazanego przez Użytkownika
                  konkretnego celu przetwarzania np. wycofanie zgody na otrzymywanie informacji handlowych bądź dotyczyć
                  wszystkich celów przetwarzania danych. Wycofanie zgody co do wszystkich celów przetwarzania spowoduje,
                  że konto Użytkownika zostanie usunięte ze strony internetowej, wraz ze wszystkimi wcześniej
                  przetwarzanymi przez administratora danymi osobowymi Użytkownika. Wycofanie zgody nie wpłynie na już
                  dokonane czynności.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może w każdej chwili żądać, bez podawania przyczyny, aby administrator usunął Jego dane.
                  Żądanie usunięcia danych nie wpłynie na dotychczas dokonane czynności. Usunięcie danych oznacza
                  jednoczesne usunięcie konta Użytkownika, wraz ze wszystkimi zapisanymi i przetwarzanymi do tej pory
                  przez administratora danymi osobowymi.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może w każdej chwili wyrazić sprzeciw przeciwko przetwarzaniu danych osobowych, zarówno w
                  zakresie wszystkich przetwarzanych przez administratora danych osobowych Użytkownika, jak również
                  jedynie w ograniczonym zakresie np. co do przetwarzania danych w konkretnie wskazanym celu. Sprzeciw
                  nie wpłynie na dotychczas dokonane czynności. Wniesienie sprzeciwu spowoduje usunięcie konta
                  Użytkownika, wraz ze wszystkimi zapisanymi i przetwarzanymi do tej pory, przez administratora, danymi
                  osobowymi.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może zażądać ograniczenia przetwarzania danych osobowych, czy to przez określony czas, czy
                  też bez ograniczenia czasowego, ale w określonym zakresie, co administrator będzie obowiązany spełnić.
                  Żądanie to nie wpłynie na dotychczas dokonane czynności.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może zażądać, aby administrator przekazał innemu podmiotowi, przetwarzane dane osobowe
                  Użytkownika. Powinien w tym celu napisać prośbę do administratora, wskazując, jakiemu podmiotowi
                  (nazwa, adres) należy przekazać dane osobowe Użytkownika oraz jakie konkretnie dane Użytkownik życzy
                  sobie, żeby administrator przekazał. Po potwierdzeniu przez Użytkownika swojego życzenia,
                  administrator przekaże, w formie elektronicznej, wskazanemu podmiotowi, dane osobowe Użytkownika.
                  Potwierdzenie przez Użytkownika żądania jest niezbędne z uwagi na bezpieczeństwo danych osobowych
                  Użytkownika oraz uzyskanie pewności, że żądanie pochodzi od osoby uprawnionej.
                </span>
              </li>
              <li>
                <span>
                  Administrator informuje Użytkownika o podjętych działaniach, przed upływem miesiąca od otrzymania
                  jednego z żądań wymienionych w poprzednich punktach.
                </span>
              </li>
            </ol>
          </li>

          {/* VI */}
          <li className="marker:font-bold">
            <h2 className="font-bold">OKRES PRZECHOWYWANIA DANYCH OSOBOWYCH</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  Zasadniczo dane osobowe są przechowywane tylko tak długo, jak to jest konieczne do wypełnienia
                  zobowiązań umownych lub ustawowych, dla których zostały one zgromadzone. Dane te zostaną usunięte
                  natychmiast, gdy ich przechowywanie nie będzie konieczne, w celach dowodowych, zgodnie z prawem
                  cywilnym lub w związku z ustawowym obowiązkiem przechowywania danych.
                </span>
              </li>
              <li>
                <span>
                  Informacje, dotyczące umowy, przechowuje się w celach dowodowych, przez okres trzech lat, począwszy od
                  końca roku, w którym zakończono relacje handlowe z Użytkownikiem. Usunięcie danych nastąpi po upływie
                  ustawowego terminu przedawnienia dochodzenia roszczeń umownych.
                </span>
              </li>
              <li>
                <span>
                  Ponadto, administrator może zachować informacje archiwalne, dotyczące zawartych transakcji, gdyż ich
                  przechowywanie jest związane z przysługującymi Użytkownikowi roszczeniami np. z tytułu rękojmi.
                </span>
              </li>
              <li>
                <span>
                  Jeśli żadna umowa nie została zawarta, między Użytkownikiem i Właścicielem, dane osobowe Użytkownika
                  są przechowywane do czasu usunięcia konta Użytkownika na stronie internetowej. Usunięcie konta może
                  nastąpić w wyniku wysunięcia żądania przez Użytkownika, wycofania zgody na przetwarzanie danych
                  osobowych, bądź też zgłoszenia sprzeciwu co do przetwarzania tych danych.
                </span>
              </li>
            </ol>
          </li>

          {/* VII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">POWIERZENIE PRZETWARZANIA DANYCH INNYM PODMIOTOM</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  Administrator może powierzać przetwarzanie danych osobowych podmiotom współpracującym z
                  administratorem, w zakresie niezbędnym dla realizacji transakcji np. w celu przygotowania zamówionego
                  towaru oraz dostarczania przesyłek lub przekazywania informacji handlowych, pochodzących od
                  administratora (ostatnie dotyczy Użytkowników, którzy wyrazili zgodę na otrzymywanie informacji
                  handlowych).
                </span>
              </li>
              <li>
                <span>
                  Poza celami, wskazanymi w niniejszej Polityce Prywatności, dane osobowe Użytkowników, nie będą w żaden
                  sposób udostępniane osobom trzecim, ani przekazywane innym podmiotom, w celu przesyłania materiałów
                  marketingowych tych osób trzecich.
                </span>
              </li>
              <li>
                <span>
                  Dane osobowe Użytkowników strony internetowej nie są przekazywane poza obszar Unii Europejskiej.
                </span>
              </li>
              <li>
                <span>
                  Niniejsza Polityka Prywatności jest zgodna z przepisami wynikającymi z art. 13 ust. 1 i ust. 2
                  rozporządzenia RODO.
                </span>
              </li>
            </ol>
          </li>

          {/* VIII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">PLIKI COOKIES</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  <span>
                    Strona internetowa używa plików cookies (ciasteczka) lub podobną technologię (dalej łącznie
                    nazywane: &bdquo;
                  </span>
                </span>
                <span>
                  <span className="font-semibold">cookies</span>
                </span>
                <span>
                  &quot;) do zbierania informacji o dostępie Użytkownika do strony internetowej (np. za pomocą komputera
                  lub smartfonu) oraz jego preferencjach. Są one wykorzystywane m.in. w celach reklamowych i
                  statystycznych oraz w celu dostosowania strony internetowej do indywidualnych potrzeb Użytkownika.
                </span>
              </li>
              <li>
                <span>
                  Pliki cookies to fragmenty informacji, które zawierają unikalny kod referencyjny, który strona
                  internetowa przesyła na urządzenie Użytkownika, w celu przechowywania, a czasem śledzenia informacji,
                  dotyczących używanego urządzenia. Zwykle nie pozwalają one zidentyfikować osoby Użytkownika. Ich
                  głównym zadaniem jest lepsze dopasowanie strony internetowej do Użytkownika.
                </span>
              </li>
              <li>
                <span>
                  Niektóre z plików cookies, występujące na stronie internetowej, są dostępne tylko przez czas trwania
                  danej sesji internetowej i wygasają po zamknięciu przeglądarki. Inne pliki cookies służą do
                  zapamiętywania Użytkownika, który po powrocie na stronę internetową, jest na niej rozpoznawany. Są one
                  wówczas zachowywane przed dłuższy czas.
                </span>
              </li>
              <li>
                <span>Pliki cookies używane na niniejszej stronie internetowej to:</span>
                <ul className="list-disc ml-4">
                  <li>
                    <span> next-auth.callback-url: usuwany po zamknięciu przeglądarki </span>
                  </li>
                  <li>
                    <span> next-auth.csrf-token: usuwany po zamknięciu przeglądarki </span>
                  </li>
                  <li>
                    <span>next-auth.session-token: 29 dni </span>
                  </li>
                </ul>
              </li>
              <li>
                <span>
                  Wszystkie pliki cookies, występujące na stronie internetowej, są ustalane przez administratora.
                </span>
              </li>
              <li>
                <span>
                  Wszystkie pliki cookies, używane przez niniejszą stronę internetową, są zgodne z obowiązującym prawem
                  Unii Europejskiej.
                </span>
              </li>
              <li>
                <span>
                  Większość Użytkowników i niektórych przeglądarek mobilnych automatycznie akceptuje pliki cookies.
                  Jeżeli Użytkownik nie zmieni ustawień, pliki cookies zostaną zapisane w pamięci urządzenia.
                </span>
              </li>
              <li>
                <span>
                  Użytkownik może zmienić preferencje, dotyczące akceptacji plików cookies lub zmienić przeglądarkę, aby
                  móc otrzymać za każdym razem stosowne powiadomienie, gdy funkcja cookies jest ustawiona. Aby zmienić
                  ustawienia akceptacji cookies, należy dostosować ustawienia w przeglądarce.
                </span>
              </li>
              <li>
                <span>
                  Warto pamiętać, że blokowanie lub usuwanie plików cookies może uniemożliwić pełne korzystanie ze
                  strony internetowej.
                </span>
              </li>
              <li>
                <span>Pliki cookies będą wykorzystywane do niezbędnego zarządzania sesją, w tym:</span>

                <ol className="list-[lower-latin] text-justify ml-4">
                  <li>
                    <span>
                      Tworzenia specjalnej sesji logowania dla Użytkownika strony internetowej, aby strona zapamiętała,
                      że Użytkownik jest zalogowany, a jego żądania były dostarczane w sposób skuteczny, bezpieczny i
                      spójny;
                    </span>
                  </li>
                  <li>
                    <span>
                      Rozpoznawania Użytkownika, który już wcześniej odwiedził stronę internetową, co pozwala na
                      identyfikację liczby unikalnych użytkowników, którzy skorzystali z serwisu i pozwala upewnić się
                      co do wystarczającej pojemności serwisu dla liczby nowych użytkowników;
                    </span>
                  </li>
                  <li>
                    <span>
                      Rozpoznawania, czy osoba odwiedzająca stronę internetową jest zarejestrowana na stronie
                      internetowej;
                    </span>
                  </li>
                  <li>
                    <span>
                      Rejestrowanie informacji z urządzenia Użytkownika, w tym: pliki cookies, adres IP i informacje o
                      używanej przeglądarce, w celu możliwości diagnozowania problemów, administrowania i śledzenia
                      Użytkowania witryny;
                    </span>
                  </li>
                  <li>
                    <span>Dostosowywania elementów układu szaty graficznej lub zawartości strony internetowej;</span>
                  </li>
                  <li>
                    <span>
                      Zbierania informacji statystycznych o tym, jak Użytkownik korzysta ze strony, w celu możliwości
                      ulepszania witryny i stwierdzenia, które zakresy strony internetowej są najbardziej popularne dla
                      Użytkowników.
                    </span>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
