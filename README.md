# EmailMaker_API
Salve Primo, adicionei o readme pra vc entender melhor como funfa a API

A proposta do app todo é o usuario mandar num forms o nome dos componentes, e a api pega esses componentes que tão na pasta views, escreve um HTML pronto e disponibiliza pra download (e deleta a copia interna logo após pra nao floodar).

pra isso eu usei um préprocessador chamado nunjucks, que suporta componentes.

ai eu faço o template.njk e compilo no html final e cuspo pra download.

O nome dos componentes vem em um array "componentes".
A cor do background vem dentro de um array "background" como é um HEX eu limitei a 7 chars pra nao zuar a cor do  html no final


Tem um monte de modulo inutil de node que eu peguei quando tava escrevendo btw