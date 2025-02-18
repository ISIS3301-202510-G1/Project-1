## Descripción de las variables
| **Variable**       | **Descripción**                                                                     | **Tipo**      |
|--------------------|-------------------------------------------------------------------------------------|---------------|
| objid              | Identificador único del objeto observado                                            | Identificador |
| ra, dec            | Coordenadas celestes (ascensión recta y declinación)                                | Numérica      |
| u, g, r, i, z      | Magnitudes de luz en distintos filtros de color                                     | Numérica      |
| run, camcol, field | Información contextual sobre las capturas                                           | Mixta         |
| score              | Puntuación de calidad local de la observación                                       | Numérica      |
| clean              | Indicador de calidad de observación (1 si es confiable, 0 si no)                    | Binaria       |
| class              | Clase del objeto: Estrella (**`STAR`**), Galaxia (**`GALAXY`**), Cuásar (**`QSO`**) | Categórica    |
| redshift           | Corrimiento al rojo de los objetos celestes (objetivo)                              | Numérica      |
| mjd                | Fecha de la observación en días julianos                                            | Numérica      |
| rowv, colv         | Velocidades horizontal y vertical del telescopio                                    | Numérica      |
