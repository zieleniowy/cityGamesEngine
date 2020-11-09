# Silnik do tworzenia gier miejskich

## build-api
### adding page

api.<player/admin>.addPage((string)href, (string)label, (string)menu, (component)icon)

href - url tworzonej strony 
label - ścieżka dostępu do tekstu linku - 
menu - "tab"/"drawer"/"none" - aby umieścić link w jednym z dwóch wbudowanych menu lub nie umieszać w żadnym. Można przekazać dowolny ciąg znaków, w przypadku tworzenia własnych menu.
icon - dowolny komponent 


example: 


```

api.player.addPage('/calendar', 'calendar.pageLabel', 'tab', api.materialIcon('Event'))

```


## server-api