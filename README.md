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
Dodaje do aplikacji dla graczy komponent z pliku PlayerInventory.js, a następnie umieszcza go na stronie głównej.

## server-api