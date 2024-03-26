import Link from 'next/link';
import React from 'react';

const RulesPage = () => {
  return (
    <div className="py-12 px-8 md:px-12 flex relative max-w-[1920px] w-full justify-center mx-auto">
      <div className="flex flex-col max-w-screen-lg space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-center flex flex-col mb-2">
            <span>REGULAMIN SKLEPU INTERNETOWEGO</span>
          </h1>
          <p className="text-muted-foreground text-center mb-4">Z dnia 26.03.2024r</p>
        </div>

        <ol className="space-y-4 list-[upper-roman]">
          {/* I */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Postanowienia wstępne</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>
                  Sklep internetowy Sawiniec-Olejarnia w zgodzie z naturą, dostępny pod adresem internetowym
                  https://olejesawiniec.pl prowadzony jest przez Annę Sawiniec, zamieszkałą Cześniki kolonia 26, 22-424
                  Sitno. Prowadzącego sprzedaż na zasadach Rolniczego Handlu Detalicznego pod numerem 6980/0320/2023
                  nadanym przez Powiatowej Stacji Sanitarno-Epidemiologicznej w Zamościu
                </span>
              </li>
              <li>numer gospodarstwa KOWR: 040292964</li>
              <li>
                Niniejszy Regulamin skierowany jest zarówno do Konsumentów, jak i do Przedsiębiorców korzystających ze
                Sklepu i określa zasady korzystania ze Sklepu internetowego oraz zasady i tryb zawierania Umów Sprzedaży
                z Klientem na odległość za pośrednictwem Sklepu.
              </li>
            </ol>
          </li>

          {/* II */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Definicje</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Konsument - osoba fizyczna zawierająca ze Sprzedawcą umowę w ramach Sklepu, której przedmiot nie jest
                związany bezpośrednio z jej działalnością gospodarczą lub zawodową.
              </li>
              <li>Sprzedawca - Anna Sawiniec, Cześniki kolonia 26, 22-424 Sitno</li>
              <li>Klient - każdy podmiot dokonujący zakupów za pośrednictwem Sklepu.</li>
              <li>
                Przedsiębiorca - osoba fizyczna, osoba prawna i jednostka organizacyjna niebędąca osobą prawną, której
                odrębna ustawa przyznaje zdolność prawną, wykonująca we własnym imieniu działalność gospodarczą, która
                korzysta ze Sklepu.
              </li>
              <li>
                Sklep - sklep internetowy prowadzony przez Sprzedawcę pod adresem internetowym{' '}
                <Link href="https://olejesawiniec.pl" className="underline">
                  olejesawiniec.pl
                </Link>
              </li>
              <li>
                Umowa zawarta na odległość - umowa zawarta z Klientem w ramach zorganizowanego systemu zawierania umów
                na odległość (w ramach Sklepu), bez jednoczesnej fizycznej obecności stron, z wyłącznym wykorzystaniem
                jednego lub większej liczby środków porozumiewania się na odległość do chwili zawarcia umowy włącznie.
              </li>
              <li>Regulamin - niniejszy regulamin Sklepu.</li>
              <li>
                Zamówienie - oświadczenie woli Klienta składane za pomocą Formularza Zamówienia i zmierzające
                bezpośrednio do zawarcia Umowy Sprzedaży Produktu lub Produktów ze Sprzedawcą.
              </li>
              <li>
                Konto - konto klienta w Sklepie, są w nim gromadzone dane podane przez Klienta oraz informacje o
                złożonych przez niego Zamówieniach w Sklepie.
              </li>
              <li>Formularz rejestracji - formularz dostępny w Sklepie, umożliwiający utworzenie Konta.</li>
              <li>
                Formularz zamówienia - interaktywny formularz dostępny w Sklepie umożliwiający złożenie Zamówienia, w
                szczególności poprzez dodanie Produktów do Koszyka oraz określenie warunków Umowy Sprzedaży, w tym
                sposobu dostawy i płatności.
              </li>
              <li>
                Koszyk - element oprogramowania Sklepu, w którym widoczne są wybrane przez Klienta Produkty do zakupu, a
                także istnieje możliwość ustalenia i modyfikacji danych Zamówienia, w szczególności ilości produktów.
              </li>
              <li>
                Produkt - dostępna w Sklepie rzecz ruchoma/towar będąca przedmiotem Umowy Sprzedaży między Klientem a
                Sprzedawcą.
              </li>
              <li>
                Umowa Sprzedaży - umowa sprzedaży Produktu zawierana albo zawarta między Klientem a Sprzedawcą za
                pośrednictwem Sklepu internetowego.
              </li>
              <li>Polityka prywatności - polityka prywatności zamieszczona na stronie sklepu Sprzedającego.</li>
            </ol>
          </li>

          {/* III */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Postanowienia wstępne</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                <span>Kontakt ze Sklepem Adres Sprzedawcy:</span>
                <div className="flex flex-col">
                  <span>Rolniczy Handel Detaliczny Anna Sawiniec</span>
                  <span>Cześniki kolonia 26</span>
                  <span>22-424 Sitno</span>
                </div>
              </li>
              <li>
                Adres e-mail Sprzedawcy:{' '}
                <Link className="underline" href="mailto:Sawiniec.olejarnia@gmail.com">
                  Sawiniec.olejarnia@gmail.com
                </Link>
              </li>
              <li>Numer telefonu Sprzedawcy: 780031831</li>
              <li>Numer rachunku bankowego Sprzedawcy: 19102053560000150202508315</li>
              <li>
                Klient może porozumiewać się ze Sprzedawcą za pomocą adresów i numerów telefonów podanych w niniejszym
                paragrafie.
              </li>
              <li>Klient może porozumieć się telefonicznie ze Sprzedawcą w dni robocze w godzinach 9-18</li>
            </ol>
          </li>

          {/* IV */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Wymagania techniczne</h2>
            <p>
              Do korzystania ze Sklepu, w tym przeglądania asortymentu Sklepu oraz składania zamówień na Produkty,
              niezbędne są:
            </p>
            <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
              <li>urządzenie końcowe z dostępem do sieci Internet i przeglądarką internetową</li>
              <li>aktywne konto poczty elektronicznej (e-mail),</li>
              <li>włączona obsługa plików cookies,</li>
            </ol>
          </li>

          {/* V */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Informacje ogólne</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Sprzedawca w najszerszym dopuszczalnym przez prawo zakresie nie ponosi odpowiedzialności za zakłócenia w
                tym przerwy w funkcjonowaniu Sklepu spowodowane siłą wyższą, niedozwolonym działaniem osób trzecich lub
                niekompatybilnością Sklepu internetowego z infrastrukturą techniczną Klienta.
              </li>
              <li>
                Przeglądanie asortymentu Sklepu nie wymaga zakładania Konta. Składanie zamówień przez Klienta na
                Produkty znajdujące się w asortymencie Sklepu możliwe jest albo po założeniu Konta zgodnie z
                postanowieniami &sect; 6 Regulaminu albo przez podanie niezbędnych danych osobowych i adresowych
                umożliwiających realizację Zamówienia bez zakładania Konta.
              </li>
              <li>Ceny podane w Sklepie są podane w polskich złotych.</li>
            </ol>
          </li>

          {/* VII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Zakładanie Konta w Sklepie</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Aby założyć Konto w Sklepie, należy wypełnić Formularz rejestracji. Celem rejestracji Kupujący powinien
                podać login i hasło, niezbędne do uzyskania dostępu do swojego konta. Login i hasło są ciągiem znaków
                ustalanych przez Kupującego, który ma obowiązek zachowania ich w tajemnicy i chronienia przed
                niepowołanym dostępem osób trzecich. Kupujący ma w każdej chwili prawo i możliwość wglądu, poprawiania,
                aktualizacji danych.
              </li>
              <li>Założenie Konta w Sklepie jest darmowe.</li>
              <li>
                Logowanie się na Konto odbywa się poprzez podanie loginu i hasła ustanowionych w Formularzu rejestracji.
              </li>
              <li>
                Klient ma możliwość w każdej chwili, bez podania przyczyny i bez ponoszenia z tego tytułu jakichkolwiek
                opłat usunąć Konto poprzez wysłanie stosownego żądania do Sprzedawcy, w szczególności za pośrednictwem
                poczty elektronicznej lub pisemnie na adresy podane w &sect; 3.
              </li>
            </ol>
          </li>

          {/* VII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Zasady składania Zamówienia</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>Oferta ważna jest tylko na terenie Polski.</li>
              <li>
                Zamówienia mogą składać tylko osoby pełnoletnie posiadające pełną zdolność do czynności prawnych, oraz
                osoby prawne lub jednostki organizacyjne nie posiadające osobowości prawnej, a posiadające zdolność do
                czynności prawnych.
              </li>
              <li>
                Sprzedający zastrzega sobie prawo do wycofania poszczególnych produktów ze sprzedaży lub zmiany ich cen.
                W przypadku zmiany cen produktów lub ich braku w magazynie Sprzedający niezwłocznie zobowiązuje się do
                poinformowania o tym Kupującego. W razie braku akceptacji nowej ceny lub nowego terminu realizacji,
                zamówienie nie będzie realizowane.
              </li>
              <li>
                <span>W celu złożenia Zamówienia należy:</span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>zalogować się do Sklepu (opcjonalnie);</li>
                  <li>
                    wybrać Produkt będący przedmiotem Zamówienia, a następnie kliknąć przycisk &bdquo;Dodaj do
                    koszyka&rdquo;;
                  </li>
                  <li>zalogować się lub skorzystać z możliwości złożenia Zamówienia bez rejestracji;</li>
                  <li>
                    jeżeli wybrano możliwość złożenia Zamówienia bez rejestracji - wypełnić Formularz zamówienia poprzez
                    wpisanie danych odbiorcy Zamówienia oraz adresu, na który ma nastąpić dostawa Produktu, wybrać
                    rodzaj przesyłki (sposób dostarczenia Produktu).
                  </li>
                  <li>kliknąć przycisk &ldquo;Zamawiam i płacę&rdquo;</li>
                  <li>
                    wybrać jeden z dostępnych sposobów płatności i w zależności od sposobu płatności, opłacić zamówienie
                    w określonym terminie, z zastrzeżeniem &sect; 8 pkt 3.
                  </li>
                </ol>
              </li>
            </ol>
          </li>

          {/* VIII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Płatność i dostawa</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>Ceny towarów znajdujących się w sklepie wyrażone są w złotych polskich.</li>
              <li>
                Sprzedający nie wystawia dokumentów sprzedaży np. paragon, rachunek czy faktura ani żadnego innego.
              </li>
              <li>
                Sprzedający prowadzi Rolniczy Handel Detaliczny dla którego uzyskał stosowny numer 6980/0320/2023 od
                Powiatowej Stacji Sanitarno-Epidemiologicznej w Zamościu
              </li>
              <li>
                Kupujący prowadzący działalność gospodarczą i w ramach jej prowadzenia dokonujący zakupów w sklepie
                internetowym Sprzedającego za pomocą formularza, może wystawić sprzedającemu fakturę typu RR
                poświadczającą zakup i przesłać ją Sprzedającemu w formie elektronicznej na adres{' '}
                <Link className="underline" href="mailto:Sawiniec.olejarnia@gmail.com">
                  Sawiniec.olejarnia@gmail.com
                </Link>{' '}
                Sprzedający potwierdzi ją i odeśle kupującemu również w formie elektronicznej.
              </li>
              <li>
                Zamówione towary są dostarczane do klienta za pośrednictwem firmy kurierskiej współpracującej z
                sprzedającym. Zakupione towary dostarczane są pod adres wskazany w formularzu zamówień.
              </li>
              <li>
                Płatność za zamówione produkty dokonywana jest w miejscu odbioru zamówienia, do rąk Doręczyciela lub
                przelewem - wysyłka następuje po zaksięgowaniu kwoty na koncie sprzedającego (wartość zamówionych
                produktów plus koszty wysyłki).
              </li>
              <li>
                Koszt dostawy zamówionych produktów, w zależności od ich ilości lub wagi, podany jest w zakładce
                &bdquo;koszty dostawy&rdquo;.
              </li>
              <li>Zamówienia powyżej 200 zł dostarczane są bezpłatnie.</li>
              <li>
                Kupujący ma prawo do sprawdzenia zawartości paczki w obecności Doręczyciela, co Sprzedający zaleca. W
                przypadku stwierdzenia niekompletności zamówienia Kupujący powinien poinformować Sprzedającego ze
                wskazaniem brakujących produktów i przyjąć niekompletną przesyłkę.
              </li>
              <li>
                W przypadku uznania zgłoszenia przez Sprzedającego, dosłanie brakujących produktów następuje na jego
                koszt w terminie do 5 dni roboczych.
              </li>
            </ol>
          </li>

          {/* IX */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Wykonanie umowy sprzedaży</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Zawarcie Umowy Sprzedaży między Klientem a Sprzedawcą następuje po uprzednim złożeniu przez Klienta
                Zamówienia za pomocą Formularza zamówienia w Sklepie internetowym zgodnie z &sect; 7 Regulaminu.
              </li>
              <li>
                Po złożeniu Zamówienia Sprzedawca niezwłocznie potwierdza jego otrzymanie oraz jednocześnie przyjmuje
                Zamówienie do realizacji. Potwierdzenie otrzymania Zamówienia i jego przyjęcie do realizacji następuje
                poprzez przesłanie przez Sprzedawcę Klientowi stosownej wiadomości e-mail na podany w trakcie składania
                Zamówienia adres poczty elektronicznej Klienta, która zawiera co najmniej oświadczenia Sprzedawcy o
                otrzymaniu Zamówienia i o jego przyjęciu do realizacji oraz potwierdzenie zawarcia Umowy Sprzedaży. Z
                chwilą otrzymania przez Klienta powyższej wiadomości e-mail zostaje zawarta Umowa Sprzedaży między
                Klientem a Sprzedawcą.
              </li>
              <li>
                <span>W przypadku wyboru przez Klienta:</span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>
                    płatności przelewem, płatności elektronicznych albo płatności kartą płatniczą, Klient obowiązany
                    jest do dokonania płatności w terminie 2 dni kalendarzowych od dnia zawarcia Umowy Sprzedaży - w
                    przeciwnym razie zamówienie zostanie anulowane.
                  </li>
                  <li>
                    płatności za pobraniem przy odbiorze przesyłki, Klient obowiązany jest do dokonania płatności przy
                    odbiorze przesyłki.
                  </li>
                  <li>
                    płatności gotówką przy odbiorze osobistym przesyłki, Klient obowiązany jest dokonać płatności przy
                    odbiorze przesyłki.
                  </li>
                </ol>
              </li>
              <li>
                Jeżeli Klient wybrał sposób dostawy inny niż odbiór osobisty, Produkt zostanie wysłany przez Sprzedawcę
                w terminie wskazanym w jego opisie, w sposób wybrany przez Klienta podczas składania Zamówienia.
              </li>
              <li>
                <span>Początek biegu terminu dostawy Produktu do Klienta liczy się w następujący sposób:</span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>
                    W przypadku wyboru przez Klienta sposobu płatności przelewem, płatności elektroniczne lub kartą
                    płatniczą - od dnia uznania rachunku bankowego Sprzedawcy, licząc wyłącznie dni robocze.
                  </li>
                  <li>
                    W przypadku wyboru przez Klienta sposobu płatności za pobraniem - od dnia zawarcia Umowy Sprzedaży,
                    licząc wyłącznie dni robocze.
                  </li>
                </ol>
              </li>
              <li>
                W przypadku wyboru przez Klienta odbioru osobistego Produktu, Produkt będzie gotowy do odbioru przez
                Klienta w terminie wskazanym w opisie Produktu. O gotowości Produktu do odbioru Klient zostanie
                dodatkowo poinformowany przez Sprzedawcę poprzez przesłanie stosownej wiadomości e-mail na podany w
                trakcie składania Zamówienia adres poczty elektronicznej Klienta.
              </li>
              <li>Dostawa Produktu odbywa się wyłącznie na terenie Polski.</li>
            </ol>
          </li>

          {/* X */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Prawo odstąpienia od umowy</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>Konsument może w terminie 14 dni odstąpić od Umowy Sprzedaży bez podania jakiejkolwiek przyczyny.</li>
              <li>
                Bieg terminu określonego w ust. 1 rozpoczyna się od dostarczenia Produktu Konsumentowi lub wskazanej
                przez niego osobie innej niż przewoźnik.
              </li>
              <li>
                Konsument może odstąpić od Umowy, składając Sprzedawcy oświadczenie o odstąpieniu od Umowy. Do
                zachowania terminu odstąpienia od Umowy wystarczy wysłanie przez Konsumenta oświadczenia przed upływem
                tego terminu.
              </li>
              <li>
                Oświadczenie może być wysłane za pomocą tradycyjnej poczty poprzez przesłanie go na adres Sprzedawcy -
                dane kontaktowe Sprzedawcy zostały określone w &sect; 3. Oświadczenie można złożyć również na
                formularzu, którego wzór stanowi załącznik nr 1 do niniejszego Regulaminu oraz załącznik do ustawy z
                dnia 30 maja 2014 roku o prawach konsumenta, jednak nie jest to obowiązkowe.
              </li>
              <li>
                W przypadku przesłania oświadczenia przez Konsumenta drogą elektroniczną, Sprzedawca niezwłocznie
                prześle Konsumentowi na podany przez Konsumenta adres e-mail potwierdzenie otrzymania oświadczenia o
                odstąpieniu od Umowy.
              </li>
              <li>
                <span>Skutki odstąpienia od Umowy:</span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>W przypadku odstąpienia od Umowy zawartej na odległość Umowę uważa się za niezawartą.</li>
                  <li>
                    W przypadku odstąpienia od Umowy Sprzedawca zwraca Konsumentowi niezwłocznie, nie później niż w
                    terminie 14 dni od dnia otrzymania oświadczenia Konsumenta o odstąpieniu od Umowy, wszystkie
                    dokonane przez niego płatności, w tym koszty dostarczenia rzeczy, z wyjątkiem dodatkowych kosztów
                    wynikających z wybranego przez Konsumenta sposobu dostarczenia innego niż najtańszy zwykły sposób
                    dostarczenia oferowany przez Sprzedawcę.
                  </li>
                  <li>
                    Zwrotu płatności Sprzedawca dokona przy użyciu takich samych metod płatności, jakie zostały przez
                    Konsumenta użyte w pierwotnej transakcji, chyba że Konsument wyraźnie zgodził się na inne
                    rozwiązanie, które nie będzie się wiązało dla niego z żadnymi kosztami.
                  </li>
                  <li>
                    Sprzedawca może wstrzymać się ze zwrotem płatności do czasu otrzymania Produktu z powrotem lub do
                    czasu dostarczenia mu dowodu jego odesłania, w zależności od tego, które zdarzenie nastąpi
                    wcześniej.
                  </li>
                  <li>
                    Konsument powinien odesłać Produkt na adres Sprzedawcy podany w niniejszym Regulaminie niezwłocznie,
                    nie później niż 14 dni od dnia, w którym poinformował Sprzedawcę o odstąpieniu od Umowy. Termin
                    zostanie zachowany, jeśli Konsument odeśle Produkt przed upływem terminu 14 dni.
                  </li>
                  <li>
                    Konsument ponosi bezpośrednie koszty zwrotu Produktu, także koszty zwrotu Produktu, jeśli ze względu
                    na swój charakter Produkt ten nie mógł zostać w zwykłym trybie odesłany pocztą.
                  </li>
                  <li>
                    Konsument odpowiada tylko za zmniejszenie wartości Produktu wynikające z korzystania z niego w
                    sposób inny niż było to konieczne do stwierdzenia charakteru, cech i funkcjonowania Produktu.
                  </li>
                </ol>
              </li>
              <li>
                W przypadku gdy ze względu na charakter Produktu nie może on zostać odesłany w zwykłym trybie pocztą,
                informacja o tym, a także o kosztach zwrotu Produktu, będzie się znajdować w opisie Produktu w Sklepie.
              </li>
              <li>
                <span>
                  Prawo do odstąpienia od umowy zawartej na odległość nie przysługuje Konsumentowi w odniesieniu do
                  Umowy:
                </span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>
                    w której przedmiotem świadczenia jest rzecz nieprefabrykowana, wyprodukowana według specyfikacji
                    Konsumenta lub służąca zaspokojeniu jego zindywidualizowanych potrzeb,
                  </li>
                  <li>
                    w której przedmiotem świadczenia jest rzecz dostarczana w zapieczętowanym opakowaniu, której po
                    otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych,
                    jeżeli opakowanie zostało otwarte po dostarczeniu,
                  </li>
                  <li>
                    w które przedmiotem świadczenia jest rzecz ulegająca szybkiemu zepsuciu lub mająca krótki termin
                    przydatności do użycia,
                  </li>
                  <li>
                    o świadczenie usług, jeżeli Sprzedawca wykonał w pełni usługę za wyraźną zgodą Konsumenta, który
                    został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez Sprzedawcę
                    utraci prawo odstąpienia od Umowy,
                  </li>
                  <li>
                    w którym cena lub wynagrodzenie zależy od wahań na rynku finansowym, nad którym Sprzedawca nie
                    sprawuje kontroli, i które mogą wystąpić przed upływem terminu do odstąpienia od Umowy,
                  </li>
                  <li>
                    w której przedmiotem świadczenia są rzeczy, które po dostarczeniu, ze względu na swój charakter,
                    zostają nierozłącznie połączone z innymi rzeczami,
                  </li>
                </ol>
              </li>
            </ol>
          </li>

          {/* XI */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Reklamacja</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Zaleca się sprawdzenie zawartości przesyłki w obecności Doręczyciela, w chwili jej dostarczenia, oraz
                sporządzenie protokołu reklamacyjnego, w przypadku jej uszkodzeń i odmowy przyjęcia. Sprawdzenie
                zawartości przesyłki w obecności pracownika firmy kurierskiej jest bezpłatne i należy do jego
                obowiązków.
              </li>
              <li>
                Reklamacje dotyczące ewentualnych uszkodzeń mechanicznych powstałych podczas transportu będą
                rozpatrywane tylko w przypadku przesłania zdjęć uszkodzonych produktów na mail:{' '}
                <Link className="underline" href="mailto:sawiniec.olejarnia@gmail.com">
                  sawiniec.olejarnia@gmail.com
                </Link>{' '}
                oraz przyjęciem takiej paczki.
              </li>
              <li>Uszkodzenia gwarancyjne należy ponadto zgłaszać telefonicznie 780031831</li>
              <li>
                Jeżeli doręczana przesyłka jest wyraźnie uszkodzona (widać ślady zalania, znacznego wgniecenia,
                naddarcia opakowania itp.) zaleca się przyjęcie takiej paczki i poinformowanie Sprzedajacego o tym
                fakcie.
              </li>
              <li>
                Sprzedający ponosi odpowiedzialność wobec Kupującego na zasadach określonych w przepisach art. 556 - 576
                Kodeksu cywilnego za wady fizyczne i prawne (rękojmia). Kupujący na zasadach określonych w powyższych
                przepisach ma prawo żądania odpowiednio: usunięcia wady, wymiany rzeczy na wolną od wad, obniżenia ceny
                albo może odstąpić od umowy.
              </li>
              <li>
                Reklamacje należy kierować na adres mailowy
                <Link className="underline" href="mailto:sawiniec.olejarnia@gmail.com">
                  sawiniec.olejarnia@gmail.com
                </Link>
              </li>
              <li>
                Sprzedający zobowiązuje się do rozpatrzenia reklamacji w terminie do 14 dni, a gdyby nie było to
                możliwe, do poinformowania w tym terminie o czasie rozpatrzenia reklamacji.
              </li>
            </ol>
          </li>

          {/* XII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Dane osobowe w Sklepie internetowym</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>
                Administratorem danych osobowych Klientów zbieranych za pośrednictwem Sklepu internetowego jest
                Sprzedawca.
              </li>
              <li>
                Dane osobowe Klientów zbierane przez administratora za pośrednictwem Sklepu internetowego zbierane są w
                celu realizacji Umowy Sprzedaży, a jeżeli Klient wyrazi na to zgodę - także w celu marketingowym.
              </li>
              <li>
                <span>Odbiorcami danych osobowych Klientów Sklepu internetowego mogą być:</span>
                <ol className="list-[lower-latin] text-justify ml-4 marker:font-normal">
                  <li>
                    a. W przypadku Klienta, który korzysta w Sklepie internetowym ze sposobu dostawy przesyłką pocztową
                    lub przesyłką kurierską, Administrator udostępnia zebrane dane osobowe Klienta wybranemu
                    przewoźnikowi lub pośrednikowi realizującemu przesyłki na zlecenie Administratora.
                  </li>
                  <li>
                    b. W przypadku Klienta, który korzysta w Sklepie internetowym ze sposobu płatności elektronicznych
                    lub kartą płatniczą Administrator udostępnia zebrane dane osobowe Klienta, wybranemu podmiotowi
                    obsługującemu powyższe płatności w Sklepie internetowym.
                  </li>
                </ol>
              </li>
              <li>Klient ma prawo dostępu do treści swoich danych oraz ich poprawiania.</li>
              <li>
                Podanie danych osobowych jest dobrowolne, aczkolwiek niepodanie wskazanych w Regulaminie danych
                osobowych niezbędnych do zawarcia Umowy Sprzedaży skutkuje brakiem możliwości zawarcia tejże umowy.
              </li>
              <li>
                Szczegółowe zasady zbierania, przetwarzania i przechowywania danych osobowych wykorzystywanych w celu
                realizacji zamówień przez sklep zostały opisane w zakładce Polityka prywatności.
              </li>
            </ol>
          </li>

          {/* XIII */}
          <li className="marker:font-bold">
            <h2 className="font-bold">Postanowienia końcowe</h2>
            <ol className="list-decimal text-justify ml-4 marker:font-normal">
              <li>Umowy zawierane poprzez Sklep internetowy zawierane są w języku polskim.</li>
              <li>
                Sprzedawca zastrzega sobie prawo do dokonywania zmian Regulaminu z ważnych przyczyn to jest: zmiany
                przepisów prawa, zmiany sposobów płatności i dostaw - w zakresie, w jakim te zmiany wpływają na
                realizację postanowień niniejszego Regulaminu. O zmianach regulaminu i ich zakresie Kupujący będą
                powiadamiani komunikatem pojawiającym się na stronie sklepu internetowego Sprzedającego.
              </li>
              <li>
                Składając zamówienie w sklepie internetowym Kupujący niniejszym oświadcza, iż zapoznał się z powyższym
                regulaminem, w pełni go rozumie i akceptuje jego treść.
              </li>
              <li>
                W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie powszechnie obowiązujące przepisy
                prawa polskiego, w szczególności: Kodeksu cywilnego; ustawy o świadczeniu usług drogą elektroniczną;
                ustawy o prawach konsumenta, ustawy o ochronie danych osobowych.
              </li>
              <li>
                Klient ma prawo skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń. W
                tym celu może złożyć skargę za pośrednictwem unijnej platformy internetowej ODR dostępnej pod adresem:{' '}
                <Link className="underline" href="http://ec.europa.eu/consumers/odr/">
                  http://ec.europa.eu/consumers/odr/
                </Link>
                .
              </li>
              <li>
                Informacje dotyczące internetowego systemu rozstrzygania sporów na podstawie art. 14 ust. 1 ODR
                (Internetowe rozstrzyganie sporów):
              </li>
              <li>
                Komisja Europejska zapewnia konsumentom możliwość rozstrzygania sporów w handlu internetowym zgodnie z
                art. 14 ust. 1 ODR (Internetowe rozstrzyganie sporów), na jednej z platform. Platforma (
                <Link className="underline" href="https://ec.europa.eu/consumers/odr">
                  http://ec.europa.eu/consumers/odr
                </Link>
                ) służy jako miejsce, gdzie konsumenci mogą próbować osiągnąć pozasądowe porozumienia w sporach
                wynikających z zakupów oraz umów na usługi w Internecie.
              </li>
              <li>
                Płatności internetowej obsługiwane są przy współpracy z firmą Cashbill (
                <Link className="underline" href="https://www.cashbill.pl/">
                  https://www.cashbill.pl/
                </Link>
                ) obsługuje firma CashBill S.A. ul. Sobieskiego 2, 40-082 Katowice (Instytucja płatnicza: IP10/2013).
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default RulesPage;
