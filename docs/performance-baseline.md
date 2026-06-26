# Performance Baseline

Эталонные значения метрик Lighthouse для CalClone. Используются агентом
OpenCode в workflow `lighthouse.yml` для сравнения с текущими показателями.

Метрика считается деградировавшей, если её значение ухудшилось более
чем на 10% относительно baseline.

| Метрика | Описание                          | Baseline | Хорошо      |
| ------- | --------------------------------- | -------- | ----------- |
| FCP     | First Contentful Paint            | 1.8 s    | < 1.8 s     |
| LCP     | Largest Contentful Paint          | 2.5 s    | < 2.5 s     |
| CLS     | Cumulative Layout Shift           | 0.05     | < 0.1       |
| INP     | Interaction to Next Paint         | 200 ms   | < 200 ms    |
| TBT     | Total Blocking Time               | 200 ms   | < 200 ms    |
| SI      | Speed Index                       | 3.4 s    | < 3.4 s     |

Пороговые значения пересматриваются по мере развития проекта.
При значимых улучшениях фиксируйте новый baseline в этом файле.
