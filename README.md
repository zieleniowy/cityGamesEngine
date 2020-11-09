# Silnik do tworzenia gier miejskich
Składa się z dwóch osobnych api:
1. Build api - służącego do zbudowania aplikacji - dodaje do niej nowe pliki, strony, umiejscawia komponenty
na dodanych stronach, instaluje nowe moduły z dziennika NPM itd.
1. Server api - dostępne bezpośrednio już w uruchomionej aplikacji

Gra wynikowa składa się z aplikacji dla gracza, aplikacji dla admina oraz serwera. Wszystkie trzy aplikacje są generowane przez skrypt budujący, przy pomocy build api a ich kod nie powinien być modyfikowany przez użytkownika (twórcę gry). Twórca powinien dodawać kod jedynie do folderu plugins. Nie powinien również modyfikować kodu zewnętrznych pluginów (takich, których nie jest twórcą). API ma umożliwić zmianę/rozszerzanie/usuwanie funkcjonalności bez konieczności zmiany kodu, który ją dodaje. Mimo drobnego spadku wydajności, umożliwia to synchronizację i zapewnia, że dany plugin działa tak samo w każdej grze.  

## jak zacząć
### Tworzenie nowego pluginu 
buildApi -> undefined  

<p>w folderze plugins należy stworzyć nowy folder z nazwą naszego pluginu i stworzyć w nim główny plik wejściowy naszego pluginu o nazwie **manifest.js**,
który eksportuje funkcję budującą nasz plugin. Funkcja zostanie uruchomiona podczas budowania aplikacji. Jej zadaniem jest dodanie do naszej aplikacji wszystkich komponentów naszego pluginu.</p>
<p>
dodane komponenty (na serwerze) mają dostęp do server-api podczas działania aplikacji.
</p>




## build-api
### Dodanie strony

api.<player/admin>.addPage((string)href, (string)label, (string)menu, (component)icon) -> undefined

1. href - url tworzonej strony  
1. label - ścieżka dostępu do tekstu linku -  
1. menu - "tab"/"drawer"/"none" - aby umieścić link w jednym z dwóch wbudowanych menu lub nie umieszać w żadnym. Można przekazać dowolny ciąg znaków, w przypadku tworzenia własnych menu.  
1. icon - dowolny komponent - zostanie wykorzystany jako ikona w menu (zalecane api.materialIcon)

przykład: 

```

api.player.addPage('/calendar', 'calendar.pageLabel', 'tab', api.materialIcon('Event'))

```

### dodanie komponentu do aplikacji

api.<player/admin>.addComponent(string path, string name) -> component
api.server.addComponent(string path)

### dodanie komponentu do strony

api.<player/admin>.addToPage((component) component, (string) page) -> undefined

przykład: 
```
const component = api.player.addComponent('PlayerInventory.js', 'Inventory');
api.player.addToPage('/', component);

```
Dodaje do aplikacji dla graczy komponent z pliku **PlayerInventory.js**, a następnie umieszcza go na stronie głównej.

### Ustawienie domyślnego stanu dla danego pluginu

api.<player/admin/server>.setState((Object) state)
Ustawia domyślny stan - można przekazać dowolny obiekt, należy jednak pamiętać, że wszystkie etykiety powinny być dodane przez kolejną metodę - i18n;

przykład:
```
api.server.setState({
    playerStartsWith: { amount: 1000, unit: 'pln' },
    units: { pln: 1, eur:  0.22,  usd: 0.26, gbp: 0.2 }
})
```
Przykładowy stan domyślny dla pluginu związanego z finansami. Po zbudowaniu aplikacji dostępny jest w game.<nazwa_pluginu>.state

### Ustawienia internalizacji
api.<player/admin/server>.i18n((Object) dictionary)

Przy pomocy tej metody, należy dodać wszystkie teksty, które mogą zostać wyświetlone użytkownikowi przez plugin. Wszystkie etykiety mogą być edytowane przez automatycznie generowany formularz - co pozwala na tłumaczenie gier na wiele języków lub dopasowanie jej do wielu fabuł itd.

Przykład użycia dla pluginu shops:
```
//manifest.js

api.player.i18n({
    open: 'Otwórz nowy sklep',
})
api.server.i18n({
    error: 'Nie posiadasz przedmiotów, możliwych do sprzedania w sklepie',
})
```
Rejestracja etykiet wraz z domyślnymi wartościami.
```
// komponent dodany do aplikacji gracza
// sposób pierwszy
import React from 'react';
import { useSelector } from 'react-redux';

export default props => {
    const {i18n} = useSelector(state=>state.i18n.shops)
    return (
        <button>{i18n.open}</button>
    )
}

//sposób drugi
import React from 'react';

export default props => {
    return (
        <button>{window.i18n.shops.open}</button>
    )
}
```
Korzystanie z etykiet w aplikacji gracza (lub admina)
**Uwaga!** Jeśli korzystamy ze sposobu pierwszego - komponent automatycznie wykona ponowny render podczas zmiany słownika, natomiast podczas korzystania ze sposobu drugiego, etykieta zmieni się dopiero podczas kolejnego renderowania z innego powodu.

```
// serwer
// api.i18n[plugin][label]
module.exports = api =>{
    api.cmd.register('shops_open', ()=>{ throw new Error(api.i18n.shops.error) });
}

```

Korzystanie z etykiet na serwerze

### Postprocessing domyślnego stanu pluginu
Służy, by jeden plugin mógł modyfikować stan innego pluginu (lub globalny!) już w trakcie budowy aplikacji. Np.: w celu rozszerzenia go.
api.<player/admin/server>.applyToState((function) modifier)

Funkcja modyfikująca przyjmuje obecny - kompletny stan aplikacji. Wynik funkcji jest następnie łączony ze stanem, który został jej przekazany (łączenie głębokie).

### Zainstalowanie dodatkowego modułu z rejestru npm

api.<player/admin/server>.npmInstall((string) module_name)

### sprawdzenie, czy dane pluginy są zainstalowane

(array<string>)->boolean  
przykład użycia:
```
if(api.arePluginsIncluded(['money', 'inventory']))
{
    api.player.addComponent('MoneyInInventory.js', 'MoneyInInventory');
}
```


## server-api


### cmd
Wszystkie czynności wykonywane przez gracza powinny zostać zarejestrowane przez dziennik. Dzięki temu - cała funkcjonalność aplikacji znajduje się w jednym miejscu.
Zwiększona jest czytelność dzięki jednolitemu interfejsowi.  

#### Dodanie nowej komendy

```
api.cmd.register((string) name, ({ payload, subject })->any callback,  [?({payload, subject})->boolean canUse ] )

przykład:
api.cmd.register(
    'give_item', 
    ({ payload, subject })=>giveItem(payload),
    api.account.isAdmin
);

```
1. name - nazwa, z którą nasza komenta zostanie powiązana,  
1. callback - właściwa funkcja do wykonania w ramach komendy - w argumencie przyjmuje obiekt składający się z właściwości **payload** - wszystkie argumenty podane przez wywołującego komendę, **subject** - osoba wywołująca komendę  
1. canUse - Przyjmuje takie same argumenty jak powyższa funkcja, zostaje wywołana przed nią i blokuje wywołanie komendy, gdy zwróci fałsz. (Brak uprawnień) Domyślnie zawsze fałsz.  
**uwaga** konto root ma dostęp do wszystkich koment - nie wywołuje nawet funkcji canUse. (zatem domyślnie tylko root ma dostęp do komendy)

#### Używanie komendy
Z poziomu aplikacji gracza/admina

```
window.cmd((string) name, (Object) payload) -> Promise

przykład: 
window.cmd('give_item', { player: '1', item: '1', quantity: 3 })
    .then(console.log)
    .catch(alert);

```

Lub z poziomu servera

```
api.cmd.use((Account) subject, (string) name, (Object) payload)
```


### register
Dynamiczny zbiór potoków funkcji - umożliwiają rozszerzanie funkcjonalności komend. 
Wbudowane dzienniki
- playerBeforeCreate
- playerAfterCreate
- gameStart
- gameStop
- accountUpdate



#### dodanie funkcji do potoku

```
api.register.add((string) name, (Object)->Object callback)

// przykład - dodaje graczowi pieniądze (podczas tworzenia nowego gracza) - plugin money

api.register.add('playerBeforeAdd', player=>({ money: api.game.state.money.startsWith, ...player }));
```

#### wczytanie funkcji z dziennika w dowolnym potoku
przykład użycia
```
const createPlayer = R.pipe(
    initialPlayer,
    api.register.load('playerBeforeAdd'),
    addPlayerToGameArray,
    api.register.load('playerAfterAdd')
)
```

### sprawdzenie, czy dane pluginy są zainstalowane 
(tak samo jak w build api)

### Wykonanie dodatkowych czynności, gdy pluginy są wczytane
```
api.onPluginsReady((Object payload)->undefined callback)
```
payload - złączony wynik zwrócony przez wszystkie pluginy  według schematu { [plugin.name] : plugin.return },
stan łączony przez różne pliki danego pluginu jest głęboko łączony.

### Konta użytkowników

#### aktualizacja konta
Wszystkie cechy, które ulegną zmianie zostaną automatycznie zsynchronizowane z kontem, którego dotyczą. (hook useSelector związany z danymi cechami
zostanie automatycznie uruchomiony i wykona rerender)

```
api.accounts.update((Account) userToUpdate, (Object) newProps)
// przykład - zwiększenie złota gracza o 1000
const player = game.players[0];
api.accounts.update(player, { money: 1000 + player.money||0 })
```



**UWAGA** Plugin nie powinien modyfikować cech, które modyfikowane są przez komendy (tak, aby nie pominąć uruchomienia jakiegoś potoku). 
Najlepiej wszystkie modyfikacje wykonywać jedynie wewnątrz potoków w komendach.  
przykładowo jeśli mamy plugin money, który dodaje nam komendę **give_money**, która uruchamia potok **money_beforeGive** z dziennika. Powyższy kod nie uruchomi tego potoku.

#### sprawdzenie czy konto jest adminem / graczem

```
api.accounts.isAdmin((Account) user) ->boolean
api.accounts.isPlayer((Account) user) ->boolean
```

