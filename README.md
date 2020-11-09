# Silnik do tworzenia gier miejskich

## build-api
### Dodanie strony

api.<player/admin>.addPage((string)href, (string)label, (string)menu, (component)icon)

**href** - url tworzonej strony  
**label** - ścieżka dostępu do tekstu linku -  
**menu** - "tab"/"drawer"/"none" - aby umieścić link w jednym z dwóch wbudowanych menu lub nie umieszać w żadnym. Można przekazać dowolny ciąg znaków, w przypadku tworzenia własnych menu.  
**icon** - dowolny komponent - zostanie wykorzystany jako ikona w menu (zalecane api.materialIcon)

przykład: 

```

api.player.addPage('/calendar', 'calendar.pageLabel', 'tab', api.materialIcon('Event'))

```

### dodanie komponentu do aplikacji

api.<player/admin>.addComponent(string path, string name)
api.server.addComponent(string path)

### dodanie komponentu do strony

api.<player/admin>.addToPage((component) component, (string) page)

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




## server-api