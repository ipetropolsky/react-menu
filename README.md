# Задача

Необходимо создать меню, которое рендерит ссылки одну за другой.
Если меню не влезает в одну строку,
то не поместившиеся пункты скрываются за кнопкой `Show menu`.

При нажатии на кнопку меню раскрывается дропдаун.

В реальных условиях принимаем, что меню в многомодульном проекте может меняться.
Соответственно, принимаем, что передаваемый объект menu меняется.
Иммутабельность изменений гарантируется.

Разработчик реализовал несколько React-компонентов, среди которых `Dropdown` и `Menu`.

Для более глубокого понимания задачи, можно открыть консоль, поресайзить страницу.

Проведите рефакторинг данного кода, оптимизируйте решение.
Почему вы решили изменить код тем или иным образом?
