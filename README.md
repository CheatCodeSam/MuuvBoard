Muuvboard
(/mo͞ovbôrd/)

A personal moodboard app written in Django, React, and Konva. Consider it a mixture of Pinterest, a Booru, and PureRef. No where near a presentable state, but being worked on at the moment.

Objective
Use libraries first, than refactor out as needed.
If something is too hard, quite literally just skip it
Honestly just write god awful code and fix it later, but make sure to test it.

Todos:
Refactor out Image Pin from Pins
Thumbnails for Images
Boards show last updated as last updated pin
Refactor Boards into viewset


Interesting Links:
https://codesandbox.io/s/react-konva-infinite-grid-kkndq
https://longviewcoder.com/2021/01/18/html5-canvas-bottoms-up-with-konva/
https://codesandbox.io/s/react-konva-select-and-drag-7fct5
https://facebook.github.io/flux/docs/in-depth-overview/
https://williamdurand.fr/2014/02/14/please-do-not-patch-like-an-idiot/
https://datatracker.ietf.org/doc/html/rfc6902
https://pixijs.io/examples/#/events/drag-n-drop.js
Ensure PATCH request can only modify one board per request.


Big features to still add in order:
Zooming


Authentication:
* when entering page
* * if no token, login
* * if 403 error, validate token
* * * if invalid token, login
* * * if valid token, redirect to boards list
* * if valid token, make all request on page with token



testuser123
testpass123

testuser456
ptDCaMzFaivL37V


