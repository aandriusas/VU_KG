# VU_KG
VU MIF Kompiuterinė grafika kurso dėstomo R. Krasausko užduotys 

Pratybų užduotys.

1 užduotis (BMG variantas):

* Naudojant HTML5 “canvas” pavaizduoti tris besisukančius sukibusius dantiračius (visi skirtingų diametrų);
* Dantiratis koduojamas vieną kartą – po to naudojame transformacijas, pvz.: translate(); rotate();
* Mažiausias ir didžiausias sukimosi greičiai skiriasi: A – 12 kartų, B – 20 kartų, C – 60 kartų;
* Mažiausio dantiračio padėtį galima keisti naudojant: K –  klaviatūrą, M – pelę (tai “varomasis” dantiratis – kai jis atkabintas, kiti nesisuka);
* G – greitis reguliuojamas nekeičiant FPS (kadrai per sek.) F – FPS reguliuojamas nekeičiant greičio.

Gauta 80% - dantračiai nesusilygindavo (užlipdavo vienas ant kito).

2 užduotis:

* Rasti pagrindines 4 transformacijas
* Parašyti programą, kuri generuotų tą patį paveiksliuką (interaktyviai pasirenkant žingsnių skaičių), kurio 4 dalys   nuspalvintos skirtingomis spalvomis;
* Animuoti atskirai visas 4 transformacijas: f_1,…, f_4.
  (1) nupiešti pradinę nesimetrišką figūrą X ir pasirinkti transformaciją f_i;
  (2) animuoti X taip, kad ji judėtų iš pradinės padėties į f_i(X).

Gauta 120%.
Animacijos atliekamos rodyklių pagalba (pasirenka iteracijos dydis ir iteruojama).

3 užduotis:

Sumodeliuoti sraigtinius laiptus naudojant WebGL su Three.js:
* Scenoje pavaizduoti 1 ir 2 aukšto grindis;
* Naudojamos šviesos: AmbientLight, SpotLight;
* Konstrukcija modifikuojama  keičiant parametrus: bendras aukštis, laiptų skaičius, posūkio kampas tarp pirmo ir paskutinio laipto;
* Laiptų pakopoms ir turėklams naudoti ExtrudeGeometry ir TubeGeometry.

Gauta 100%

4 užduotis:

WebGL su Three.js scena su tekstūruotais objektais, bei kameros reguliavimas:
* “figūra” surinkta iš 27 vienodų kubelių, pakeičiant standartines UV koordinates taip, kad uždėjus tekstūras iš viršaus ir iš 4 šonų (iš viso 5) matytųsi skirtingi nesubyrėję paveiksiukai. 105 variantas.

* “akmuo” – tai THREE.ConvexGeometry() pagalba atsitiktinai sugeneruotas tinklelis (mesh), kurio viršūnės užpildo nurodytą tūrį (cilindrą arba sferą); 
* apskaičiuoti natūralias UV koordinates ir pagal jas uždėti šachmatinę tekstūrą – variantai: B 
* (A) cilindras:  x^2+z^2 \le R^2, \quad 0 \le y \le H 
* (B) sfera:  x^2+y^2+z^2 \le R^2

Kameros reguliavimas:
* (i) nukreipimas į pasirinktą objektą, “dolly zoom” efektas: matymo kampo didinamas (fov argumentas iš THREE.PerspectiveCamera(…) ) kartu artinant kamerą;
* (ii) sklandus kameros perjungimas prie kito objekto, kai kamera yra aukščiau pusiaukelėje (žr. pvz. 1 ir pvz. 2 – nesklandus perjungimas), naudojant camera.up().

Gauta 92% - netiko kameros perjungimas naudojant `UP`
