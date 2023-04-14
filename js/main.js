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
    const reg_allowedType = /\B[^\-\d\.\s]+|[^\d\+\-\*\/\.]|(?<=\d+[\+\*\/\.])[\+\*\/\.]+|(?<=\d+\-)\-+|\B[\+\-\*\/][\+\-\*\/]+|\B0+|(?<=\.\d+)\.|(?<=\.)\.+/g;
    const reg_formattedVal = /(?:[\d\.])(?:[\+\-\*\/]?[\d\.])+|\d+/gmi;

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
            input.val(calc.value);
            calc.notice();// Предварительный просмотр результата
        },
        typeToInput: function(e){
            calc.value = input.val();
            calc.notice();// Предварительный просмотр результата
            if(e.which == 32){ calc.clear() } // SPACE

            // Enter - Результат
            if(e.which == 13){ calc.result() } // ENTER
        },
        clear: function(){
            calc.value = '';
            calc.placehold();
            input.val('');
            noticeVal.text('...');
        },
        result: function(){
            input.val( eval(calc.value) );
            calc.value = input.val();
        },
        notice: function(){
            // Предварительный просмотр результата. Если форматированный результат верен.
            if(reg_formattedVal.test(calc.value)){
                noticeVal.text( eval(calc.value) );
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