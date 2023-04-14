/* 
    КАРКУЛЯТОР 1.1 / 14 апреля 2023 / by Serenq
    
    Основные возможности:
    - Проверка ввода.
    - Форматирование матемитического алгоритма, можно не правильного.
    - Предварительный просмотр результата.
    - Возможность не прирывать вычисление нажимая на математические операторы.
    - После нажатия кнопки (=), обновляется ввод.
*/

//CALC.EXE
;(function(){
    const btn = $('.btn');
    const input = $('.display__input');
    const noticeVal = $('.container__notice');
    const placeholder = ['Каркулятор','2 + 2 * 2 = 8','Красота','Готов!','Приятный результат'];
    // Убирает лишние символы. Защита от ввода хуйни.
    const reg_allowedType = /\B[^\-\d\.\s]+|[^\d\+\-\*\/\.]|(?<=\d+[\+\-\*\/\.])[\+\*\/\.]+|(?<=\d+\-)\-+|\B[\+\-\*\/][\+\-\*\/]+|\B0+|(?<=\.\d+)\.|(?<=\.)\.+|(?<=\.)\-/;
    // Проверка уже введённого для вывода подсказки БЕЗ ОШИБОК!
    const reg_formattedVal = /^(?:[0-9\.]+)(?:(?:[\+\-\*\/])(?:[0-9\.]+))+$|^[0-9\.]+$/;

    let calc = {
        value: '',
        executed: false,
        placehold: function(){
            let rand = Math.floor(Math.random() * placeholder.length);
            input.attr('placeholder', placeholder[rand]);
        },
        clickToInput: function(e){
            calc.alredyDone(e);//Если посчитано, была нажата кнопка (=)
            calc.value += $(this).attr('data-btn') || '';

            // Очистить инпут по нажатию КЛЕР
            if( $(this).hasClass('btn-clr') ){ calc.clear() }

            // Если в строке уже есть выражение. Нужно вычислить
            if( $(this).hasClass('btn-execute') ){
                calc.result();
                noticeVal.text('...');
            }
            
            // Ввод данных
            input.val( calc.value ); // Ввод данных
            calc.reg_allowInput(); // Форматирование ввода
            calc.notice(); // Предварительный просмотр результата
        },
        typeToInput: function(e){
            calc.value = input.val(); // Ввод данных
            calc.reg_allowInput(); // Форматирование ввода
            calc.notice(); // Предварительный просмотр результата

            if(e.which == 32){ calc.clear() } // SPACE

            // Enter - Результат
            if(e.which == 13){ calc.result() } // ENTER
        },
        reg_allowInput: function(){
            calc.value = input.val().replace(reg_allowedType, '');
            input.val(calc.value);
        },
        reg_formatStr: function(){
            let reg = new RegExp(reg_allowedType, 'g');
            calc.value = input.val().replace(reg, '');
            input.val(calc.value);
        },
        reg_isAllow: function(){
            // Проверка шаблона вводимых данных
            return reg_allowedType.test(calc.value);
        },
        reg_isFormatted: function(){
            console.log(reg_formattedVal.test(calc.value), calc.value);
            // Проверка шаблона у уже отформатированной строки
            return reg_formattedVal.test(calc.value);
        },
        clear: function(){
            calc.value = '';
            calc.placehold();
            input.val(calc.value);
            noticeVal.text('...');
        },
        result: function(){
            let reg = new RegExp(/[\+\-\*\/\.]\.?$/,'gm'); // Убрать символы в конце
            calc.reg_allowInput(); // Форматирование ввода
            calc.reg_formatStr(); // Форматирование операторов от лишних символов
            calc.value = calc.value.replace(reg,''); // Убрать символы в конце
            calc.value = eval(calc.value);
            input.val( calc.value );
        },
        notice: function(){
            // Предварительный просмотр результата. Если форматированный результат верен.
            if( calc.reg_isFormatted() ){
                noticeVal.text(eval(calc.value));
            }
        },
        alredyDone: function(e){
            //Если посчитано, была нажата кнопка (=)
            if(calc.executed){
                calc.executed = false;
                calc.clear();
                input.val(calc.value);
            }

            if( !calc.executed && $(e.currentTarget).hasClass('btn-execute') ){calc.executed = true}
        }
    };

    btn.on('click', calc.clickToInput);
    input.on('keyup', calc.typeToInput);
}());//CALC.EXE